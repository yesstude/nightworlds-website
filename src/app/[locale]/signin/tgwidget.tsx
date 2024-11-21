"use client";

import { Button } from "~/components/ui/button";

export default function TelegramWidget() {
  return (
    <Button
      type="button"
      onClick={(e) => {
        console.log("clicked!");
        var popup_url =
          "https://oauth.telegram.org" +
          "/auth?bot_id=" +
          encodeURIComponent(6116074521) +
          "&origin=" +
          encodeURIComponent(
            location.origin || location.protocol + "//" + location.hostname
          ) +
          ("&request_access=" + encodeURIComponent("write")) +
          "&return_to=" +
          encodeURIComponent(
            "https://stunning-cod-5p77wjx5653wg5-3000.app.github.dev/api/signin/telegram"
          );
        console.log(popup_url);
        var popup = window.open(
          popup_url,
          "telegram_oauth_bot" + 6116074521,
          "width=" +
            800 +
            ",height=" +
            600 +
            ",left=" +
            200 +
            ",top=" +
            200 +
            ",status=0,location=0,menubar=0,toolbar=0"
        );
      }}
    >
      Войти с помощью Telegram
    </Button>
  );
}
