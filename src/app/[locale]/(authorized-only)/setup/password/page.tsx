"use client";

import { useRouter } from "next/navigation";
import { memo, ReactNode, useEffect, useState } from "react";
import { useTransitions } from "~/components/transition/transition-provider";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import { setIngamePassword } from "~/server/api/account-setup";

export default function SetupPage() {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const [input, setInput] = useState("");
  const error = input.length > 0 && input.length < 5 ? "too-short" : undefined;

  const router = useRouter();
  const transitions = useTransitions();

  // useEffect(() => {
  //   router.prefetch("/setup/finish");
  // }, []);

  return (
    <>
      <Icon icon="password" size={48} />
      <div>
        <h1>Внутриигровой пароль</h1>
        <p>
          Ваш способ авторизации требует установки пароля. Этот пароль вы будете
          использовать только в игре для подтверждения своей личности.
        </p>
      </div>
      <div className="flex w-full grow flex-col gap-4">
        <div className="flex w-full grow flex-col text-left text-sm [&_span]:mx-4">
          <div
            className={
              "flex place-items-center gap-4 " +
              (passwordVisibility
                ? "[&_.visibility-icon-off]:rotate-180 [&_.visibility-icon-off]:opacity-0 "
                : "[&_.visibility-icon]:-rotate-180 [&_.visibility-icon]:opacity-0")
            }
          >
            <Input
              pattern="[A-Za-z0-9_]{3,16}"
              className={
                error
                  ? "outline-2 outline-destructive has-[:focus-visible]:outline-destructive"
                  : ""
              }
              aria-invalid={error != undefined}
              required
              type={passwordVisibility ? "text" : "password"}
              placeholder="Пароль"
              name="password"
              onInput={(e) => {
                setInput(e.currentTarget.value);
              }}
            >
              <MemoButton
                type="button"
                variant="text"
                size="icon"
                onClick={() => setPasswordVisibility((v) => !v)}
                className="-mr-1 gap-0"
                noripple
              >
                <Icon
                  className="visibility-icon transition-[transform,_opacity]"
                  as="div"
                  icon="visibility"
                />
                <Icon
                  className="visibility-icon-off absolute right-[24px] -mr-[24px] transition-[transform,_opacity]"
                  as="div"
                  icon="visibility_off"
                />
              </MemoButton>
            </Input>
          </div>
          <ErrorMessage current={error} error="too-short">
            Пароль должен состоять хотя бы из 5 символов
          </ErrorMessage>
        </div>
        <div className="w-full bg-background sm:relative ">
          <div className="w-full bg-foreground/5 sm:p-0 [&_>_button]:w-full">
            <Button
              size="extended_fab"
              disabled={input.length < 5}
              onClick={() => {
                if (input.length < 5) return;

                setIngamePassword(input)
                  .then(transitions?.emphasizedLeftOut)
                  .then(() => router.push("/setup/finish"));
              }}
            >
              Установить
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

const MemoButton = memo(Button, () => true);

function ErrorMessage({
  children,
  error,
  current: status,
}: {
  children: ReactNode;
  error: "too-short";
  current?: "too-short";
}) {
  return (
    <span
      className={
        "text-destructive transition-opacity " +
        (error != status ? "max-h-0 overflow-hidden opacity-0" : "mt-2")
      }
    >
      {children}
    </span>
  );
}
