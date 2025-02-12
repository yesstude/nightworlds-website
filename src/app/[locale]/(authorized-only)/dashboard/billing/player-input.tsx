"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ClientUser } from "~/server/models/User";
import { searchUserByNickname } from "./actions";

export default function PlayerInput({
  name,
  onChange,
  defaultValue,
}: {
  name?: string;
  onChange?: (value: string | undefined) => any;
  defaultValue?: string;
}) {
  const [value, setValue] = useState<ClientUser>();
  const [error, setError] = useState<string>();

  const [rawInput, setInput] = useState(defaultValue);
  const [input] = useDebounce(rawInput, 500);

  useEffect(() => {
    if (!input || input?.trim().length === 0) {
      setValue(undefined);
      setError(undefined);
      return;
    }
    searchUserByNickname(input).then((res) => {
      if (!res) {
        setError("Игрок не зарегистрирован на NightWorlds");
        setValue(undefined);
      } else {
        setError(undefined);
        setValue(res);
      }
    });
  }, [input]);
  useEffect(() => {
    onChange?.(value?.id);
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={value?.id} />
      <Input
        variant="outlined"
        onInput={(e) => setInput(e.currentTarget.value)}
        pre={
          <img
            src={
              value?.avatarUrl || "https://mineskin.eu/helm/MHF_Steve/128.png"
            }
            loading="eager"
            className="relative -ml-1 block h-7 w-7 rounded-[4px]"
          />
        }
        className={
          error
            ? "outline-2 outline-destructive has-[:focus-visible]:outline-destructive"
            : ""
        }
        placeholder="Получатель"
        defaultValue={defaultValue}
      >
        {/* <Icon icon="edit" /> */}
        <Icon
          icon="error"
          fill
          className={
            "text-destructive transition-opacity duration-200 " +
            (error ? "opacity-100" : "opacity-0")
          }
        />
      </Input>
      {!!error && (
        <span className="px-3 text-sm leading-tight text-destructive">
          {error}
        </span>
      )}
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="text"
          className="flex h-14 cursor-pointer flex-row place-items-center justify-start gap-3 rounded-[4px] bg-transparent text-left text-[16px] outline outline-1 outline-border [&_>div]:px-4"
        >
          <img
            src="https://minotar.net/helm/Squaryyy/128.png"
            loading="eager"
            className="relative -ml-1 block h-7 w-7 rounded-[4px]"
          />
          <span className="flex-grow truncate font-medium text-foreground">
            Squaryyy
          </span>
          <Icon icon="edit" />
          {/* <span className="mt-1 flex-grow truncate font-medium text-foreground">
                Выберите игрока
              </span> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="-translate-y-[60px] rounded-[4px] bg-background p-0 text-foreground shadow-md">
        <Input variant="filled" placeholder="Никнейм" />
        <div className="flex flex-col py-2">
          <Button
            variant="text"
            className="flex h-14 cursor-pointer flex-row place-items-center justify-start gap-3 rounded-none bg-transparent text-left text-[16px] outline outline-1 outline-border [&_>div]:px-4"
          >
            <img
              src="https://minotar.net/helm/Squaryyy/128.png"
              loading="eager"
              className="relative -ml-1 block h-7 w-7 rounded-[4px]"
            />
            <span className="flex-grow truncate font-medium text-foreground">
              Squaryyy
            </span>
          </Button>
          <Button
            variant="text"
            className="flex h-14 cursor-pointer flex-row place-items-center justify-start gap-3 rounded-none bg-transparent text-left text-[16px] outline outline-1 outline-border [&_>div]:px-4"
          >
            <img
              src="https://minotar.net/helm/Squaryyy/128.png"
              loading="eager"
              className="relative -ml-1 block h-7 w-7 rounded-[4px]"
            />
            <span className="flex-grow truncate font-medium text-foreground">
              Squaryyy
            </span>
          </Button>
          <Button
            variant="text"
            className="flex h-14 cursor-pointer flex-row place-items-center justify-start gap-3 rounded-none bg-transparent text-left text-[16px] outline outline-1 outline-border [&_>div]:px-4"
          >
            <img
              src="https://minotar.net/helm/Squaryyy/128.png"
              loading="eager"
              className="relative -ml-1 block h-7 w-7 rounded-[4px]"
            />
            <span className="flex-grow truncate font-medium text-foreground">
              Squaryyy
            </span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
