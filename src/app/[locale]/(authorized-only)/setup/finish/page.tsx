"use client";

import { useRouter } from "next/navigation";
import { MaterialSymbolProps } from "react-material-symbols";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { setAccountSetUp } from "~/server/api/account";

export default function SetupPage() {
  const router = useRouter();

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
              setAccountSetUp().then(() => router.push("/dashboard"));
            }}
          >
            Продолжить
          </Button>
        </div>
      </div>
    </>
  );
}
