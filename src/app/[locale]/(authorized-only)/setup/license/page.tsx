"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MaterialSymbolProps } from "react-material-symbols";
import { useTransitions } from "~/components/transition/transition-provider";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import {
  LicenseType,
  getLicenseType,
  setLicenseType,
} from "~/server/api/account-setup";

export default function SetupPage() {
  const [type, setType] = useState<undefined | LicenseType>();
  const transitions = useTransitions();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/setup/nickname");
    getLicenseType().then((t) => setType(t));
  }, []);

  return (
    <>
      <Icon icon="key" size={48} />
      <div>
        <h1>Режим авторизации</h1>
        <p>
          Выберите как вы хотите подтверждать свою личность в игре. Вы сможете
          изменить свой выбор после первого входа в игру.
        </p>
      </div>
      <div
        className="flex flex-col [&_input:checked_+_label]:bg-primary/10 [&_input]:hidden"
        onChange={(e) => {
          const checked = e.currentTarget.querySelector(
            "input:checked"
          ) as HTMLInputElement;
          setType(checked.value as any);
        }}
      >
        <input
          type="radio"
          id="online"
          value="online"
          defaultChecked={type == "online"}
          name="license-type"
        />
        <Mode icon="license" title="Лицензия" htmlFor="online">
          Вы не сможете зайти на сервер без лицензионного лаунчера. NightWorlds
          будет проверять наличие лицензии игры.
        </Mode>
        <input
          type="radio"
          id="offline"
          value="offline"
          defaultChecked={type == "offline"}
          name="license-type"
        />
        <Mode icon="password" title="Пароль" htmlFor="offline">
          При входе вам обязательно придётся вводить внутриигровой пароль.
          Лицензия игры при этом не требуется. Не подходит для лицензионных
          аккаунтов.
        </Mode>
        <input
          type="radio"
          id="hybrid"
          value="partial"
          defaultChecked={type == "partial"}
          name="license-type"
        />
        <Mode icon="passkey" title="Гибрид" htmlFor="hybrid">
          При входе у вас спросят пароль, но предложат проверить лицензию игры.
          Если вы зашли с лицензионной копии игры, пароль вводить необязательно.
          Полезно в случаях, если вы играете из разных локаций, но не хотите
          использовать свою лицензионную учетную запись на других компьютерах.
        </Mode>
      </div>
      <div className="grow" />
      <div className="sticky bottom-0 w-full bg-background sm:relative ">
        <div className="w-full bg-foreground/5 py-4 sm:p-0 [&_>_button]:w-full">
          <Button
            size="extended_fab"
            disabled={!type}
            onClick={() => {
              if (!type) return;
              setLicenseType(type)
                .then(() => transitions?.transitionOut("emphasized-left"))
                .then(() => router.push("/setup/nickname"));
            }}
          >
            Выбрать
          </Button>
        </div>
      </div>
    </>
  );
}

function Mode({
  icon,
  title,
  children,
  htmlFor,
}: {
  icon: MaterialSymbolProps["icon"];
  title: string;
  children: string;
  htmlFor: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex cursor-pointer select-none flex-col border border-t-0 p-8 text-left transition-[background-color] first-of-type:rounded-t-[40px] first-of-type:border-t last-of-type:rounded-b-[40px] hover:bg-primary/5"
    >
      <div className="mb-2 flex flex-row place-items-start gap-2">
        <Icon icon={icon} size={24} />
        <h2>{title}</h2>
      </div>
      <p className="text-sm">{children}</p>
    </label>
  );
}
