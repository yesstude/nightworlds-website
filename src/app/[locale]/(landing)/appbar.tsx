"use client";

import Link from "next/link";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export function LandingAppBar() {
  return (
    <>
      <div className="fixed z-50 w-full rounded-b-[24px] bg-background print:relative">
        <div className="flex h-[80px] w-full place-items-center rounded-b-[24px] bg-secondary/5 px-4 shadow-md">
          <Logo />
          <div className="grow" />
          {/* <Link href="/signin"> */}
          <Button
            size="bg"
            variant="filled"
            className="hidden md:block"
            disabled
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
            size="bg"
            variant="filled"
            className="block md:hidden"
            disabled
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
