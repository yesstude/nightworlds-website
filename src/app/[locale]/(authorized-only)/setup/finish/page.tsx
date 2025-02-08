"use client";

import { useRouter } from "next/navigation";
import { useTransitions } from "~/components/transition/transition-provider";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { setAccountSetUp } from "~/server/api/account-setup";

export default function SetupPage() {
  const router = useRouter();
  const transitions = useTransitions();

  return (
    <>
      <Icon icon="check_circle" size={48} />
      <div>
        <h1>Готово!</h1>
        <p>Аккаунт настроен и готов для игры.</p>
      </div>
      <div className="grow" />
      <div className="w-full bg-background sm:relative ">
        <div className="w-full bg-foreground/5 py-4 sm:p-0 [&_>_button]:w-full">
          <Button
            size="extended_fab"
            onClick={() => {
              setAccountSetUp()
                .then(transitions?.emphasizedFadeOut)
                .then(() => router.push("/dashboard"));
            }}
          >
            Продолжить
          </Button>
        </div>
      </div>
    </>
  );
}
