"use client";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export default function PlayerInput() {
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
