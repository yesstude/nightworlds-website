"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Link from "~/components/transition/link";
import { useTransitions } from "~/components/transition/transition-provider";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import {
  NicknameAvailability,
  checkNicknameAvailability,
  setNickname,
} from "~/server/api/account-setup";

export default function SetupPage() {
  const [error, setError] = useState<NicknameAvailability | undefined>();

  const [input, setInput] = useState("");
  const [nickname] = useDebounce(input, 1000);

  const nicknameAvailabilityQuery = useQuery({
    queryKey: ["nickname-availability", nickname],
    queryFn: () => checkNicknameAvailability(nickname),
    enabled: nickname.length > 0,
  });

  const allowContinue = nicknameAvailabilityQuery.data == "available";

  useEffect(() => {
    if (nicknameAvailabilityQuery.data == "available") {
      setError(undefined);
    } else setError(nicknameAvailabilityQuery.data);
  }, [nicknameAvailabilityQuery.data]);

  const router = useRouter();
  const transitions = useTransitions();

  return (
    <>
      <Icon icon="text_select_start" size={48} />
      <div>
        <h1>Игровой никнейм</h1>
        <p>
          Вы должны будете использовать именно этот никнейм при входе в игру
        </p>
      </div>
      <div className="flex w-full grow flex-col gap-4">
        <div className="flex w-full grow flex-col text-left text-sm [&_span]:mx-4">
          <Input
            pattern="[A-Za-z0-9_]{3,16}"
            className={
              error
                ? "outline-2 outline-destructive has-[:focus-visible]:outline-destructive"
                : ""
            }
            aria-invalid={error != undefined}
            required
            type="text"
            placeholder="Ваш никнейм"
            name="nickname"
            onInput={(e) => {
              setInput(e.currentTarget.value);
            }}
          />
          <ErrorMessage current={error} error="invalid">
            Никнейм содержит недопустимые символы
          </ErrorMessage>
          <ErrorMessage current={error} error="too-short">
            Никнейм не может быть короче 3 символов
          </ErrorMessage>
          <ErrorMessage current={error} error="too-long">
            Никнейм не может быть длиннее 16 символов
          </ErrorMessage>
          <ErrorMessage current={error} error="contains-politics">
            Мы подозреваем, что этот никнейм содержит какие-либо политические
            символы или высказывания. Мы не одобряем политическую пропаганду или
            обсуждение какой-либо реальной политики на игровых серверах.
          </ErrorMessage>
          <ErrorMessage current={error} error="nonlicensed">
            Этот никнейм не лицензионный. Используйте свой лицензионный никнейм
            либо{" "}
            <Link
              className="underline"
              href="/setup/license"
              transition="emphasized-right"
            >
              смените способ авторизации
            </Link>
            .
          </ErrorMessage>
          <ErrorMessage current={error} error="licensed">
            Этот никнейм лицензионный. Используйте нелицензионный никнейм или,
            если он принадлежит вам,{" "}
            <Link
              className="underline"
              href="/setup/license"
              transition="emphasized-right"
            >
              смените способ авторизации
            </Link>
            .
          </ErrorMessage>
          <ErrorMessage current={error} error="taken">
            Этот никнейм уже используется на сервере. Используйте другой.
          </ErrorMessage>
        </div>
        <div className="w-full bg-background sm:relative ">
          <div className="w-full bg-foreground/5 sm:p-0 [&_>_button]:w-full">
            <Button
              size="extended_fab"
              disabled={!allowContinue}
              onClick={() => {
                if (!allowContinue) return;

                setNickname(nickname)
                  .then(transitions?.emphasizedLeftOut)
                  .then(() => router.push("/setup/password"));
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

function ErrorMessage({
  children,
  error,
  current: status,
}: {
  children: ReactNode;
  error: NicknameAvailability;
  current?: NicknameAvailability;
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
