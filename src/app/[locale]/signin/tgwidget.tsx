"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  authWithTelegramData,
  getTelegramBotId,
  TelegramAuthData,
} from "~/server/api/auth";

export default function TelegramWidget() {
  const [bot_id, setBotId] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);

  const t = useTranslations();

  useEffect(() => {
    getTelegramBotId().then(setBotId);
  }, []);

  return (
    <Button
      type="button"
      onClick={(e) => {
        const test_bot_id = (window as any).tg_bot_id;
        if ((!bot_id && !test_bot_id) || isPopupOpen) return;
        auth(
          { bot_id: bot_id || test_bot_id, request_access: "write" },
          authWithTelegramData,
        );
        setPopupOpen(true);
      }}
      disabled={!bot_id || bot_id?.length == 0 || isPopupOpen}
    >
      {t("signin.buttons.telegram")}
    </Button>
  );
}

function auth(
  options: { bot_id: string; request_access?: string; lang?: string },
  callback: (data: TelegramAuthData) => any,
) {
  var bot_id = parseInt(options.bot_id);
  if (!bot_id) {
    throw new Error("Bot id required");
  }
  var width = 550;
  var height = 470;
  var left =
      Math.max(0, (screen.width - width) / 2) +
      ((screen as any).availLeft || 0),
    top =
      Math.max(0, (screen.height - height) / 2) +
      ((screen as any).availTop || 0);
  var onMessage = function (event: MessageEvent) {
    try {
      var data = JSON.parse(event.data);
    } catch (e) {
      var data: any = {};
    }
    // if (!TelegramLogin.popups[bot_id]) return;
    // if (event.source !== TelegramLogin.popups[bot_id].window) return;
    if (data.event == "auth_result") {
      onAuthDone(data.result);
    }
  };
  var onAuthDone = function (authData: TelegramAuthData) {
    // if (!TelegramLogin.popups[bot_id]) return;
    // if (TelegramLogin.popups[bot_id].authFinished) return;
    callback && callback(authData);
    // TelegramLogin.popups[bot_id].authFinished = true;
    removeEvent(window, "message", onMessage);
  };
  // var checkClose = function(bot_id) {
  //   if (!TelegramLogin.popups[bot_id]) return;
  //   if (!TelegramLogin.popups[bot_id].window ||
  //       TelegramLogin.popups[bot_id].window.closed) {
  //     return TelegramLogin.getAuthData(options, function(origin, authData) {
  //       onAuthDone(authData);
  //     });
  //   }
  //   setTimeout(checkClose, 100, bot_id);
  // }
  var popup_url =
    "https://oauth.telegram.org/auth?bot_id=" +
    encodeURIComponent(options.bot_id) +
    "&origin=" +
    encodeURIComponent(
      location.origin || location.protocol + "//" + location.hostname,
    ) +
    (options.request_access
      ? "&request_access=" + encodeURIComponent(options.request_access)
      : "") +
    (options.lang ? "&lang=" + encodeURIComponent(options.lang) : "") +
    "&return_to=" +
    encodeURIComponent(location.href);
  var popup = window.open(
    popup_url,
    "telegram_oauth_bot" + bot_id,
    "width=" +
      width +
      ",height=" +
      height +
      ",left=" +
      left +
      ",top=" +
      top +
      ",status=0,location=0,menubar=0,toolbar=0",
  );
  // TelegramLogin.popups[bot_id] = {
  //   window: popup,
  //   authFinished: false
  // };
  if (popup) {
    addEvent(window, "message", onMessage);
    popup.focus();
    // checkClose(bot_id);
  }
}

function addEvent(el: any, event: any, handler: any) {
  var events = event.split(/\s+/);
  for (var i = 0; i < events.length; i++) {
    if (el.addEventListener) {
      el.addEventListener(events[i], handler);
    } else {
      el.attachEvent("on" + events[i], handler);
    }
  }
}
function removeEvent(el: any, event: any, handler: any) {
  var events = event.split(/\s+/);
  for (var i = 0; i < events.length; i++) {
    if (el.removeEventListener) {
      el.removeEventListener(events[i], handler);
    } else {
      el.detachEvent("on" + events[i], handler);
    }
  }
}
