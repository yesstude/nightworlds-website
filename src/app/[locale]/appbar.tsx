"use client";

import Link from "next/link";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export function TopBar() {
  return (
    <>
      <div className="fixed z-50 w-full bg-background print:relative">
        <div className="flex h-[80px] w-full place-items-center bg-secondary/5 px-4 shadow-md">
          <Logo />
          <div className="grow" />
          {/* <Link href="/signin"> */}
          <Button
            disabled
            size="bg"
            variant="filled"
            className="hidden md:block"
          >
            <span>Начать игру</span>
            <Icon
              className="-mx-1 translate-x-1"
              icon="arrow_right_alt"
              size={32}
              weight={200}
            />
          </Button>
          <Button
            disabled
            size="bg"
            variant="filled"
            className="block md:hidden"
          >
            <Icon icon="play_arrow" size={32} />
          </Button>
          {/* </Link> */}
        </div>
      </div>
      <div className="h-[80px] print:hidden" />
    </>
  );
}
