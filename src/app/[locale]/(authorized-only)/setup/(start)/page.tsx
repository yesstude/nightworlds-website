"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LinkButton } from "~/components/transition/link";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export default function SetupPage() {
  const router = useRouter();
  useEffect(() => {
    router.prefetch("/setup/license");
  }, []);

  return (
    <>
      <Icon icon="person" size={48} />
      <div>
        <h1>Первоначальная настройка</h1>
        <p>
          Судя по всему, это ваш первый раз на NightWorlds! Позвольте нам помочь
          вам приступить к игре максимально быстро
        </p>
      </div>
      <div className="grow" />
      <div className="fixed bottom-0 w-full bg-background sm:relative sm:p-0 ">
        <div className="w-full bg-foreground/5 p-4">
          <LinkButton
            href="/setup/license"
            className="w-full"
            size="extended_fab"
            transition="emphasized-left"
          >
            Начать
          </LinkButton>
        </div>
      </div>
    </>
  );
}
