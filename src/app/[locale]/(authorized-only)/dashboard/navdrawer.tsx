import Link from "next/link";
import { ReactNode } from "react";
import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export default function NavDrawer() {
  return (
    <>
      <div className="hidden h-full min-w-[360px] max-w-[360px] lg:block" />
      <div className="fixed hidden max-h-[100vh] w-full max-w-[360px] flex-col py-4 lg:flex">
        <Logo className="mx-4 mb-6 mt-2" />
        <Link href="#" className="mx-[12px]">
          <Button
            size="bg"
            variant="text"
            className="h-[56px] w-full bg-foreground/5 [&_div]:p-0"
          >
            <div className="ml-4 mr-6 flex grow flex-row place-items-center justify-start gap-3 font-bold text-foreground">
              <Icon icon="home" size={24} className="-translate-y-[1px]" fill />
              <span className="grow text-left">Домашняя страница</span>
              <span>24</span>
            </div>
          </Button>
        </Link>
        <Link href="#" className="mx-[12px]">
          <Button
            size="bg"
            variant="text"
            className="h-[56px] w-full [&_div]:p-0"
          >
            <div className="ml-4 mr-6 flex grow flex-row place-items-center justify-start gap-3 font-bold text-foreground">
              <Icon icon="home" size={24} className="-translate-y-[1px]" />
              <span className="grow text-left">Домашняя страница</span>
              <span>24</span>
            </div>
          </Button>
        </Link>
        <Link href="#" className="mx-[12px]">
          <Button
            size="bg"
            variant="text"
            className="h-[56px] w-full [&_div]:p-0"
          >
            <div className="ml-4 mr-6 flex grow flex-row place-items-center justify-start gap-3 font-bold text-foreground">
              <Icon icon="home" size={24} className="-translate-y-[1px]" />
              <span className="grow text-left">Домашняя страница</span>
              <span>24</span>
            </div>
          </Button>
        </Link>
        <Link href="#" className="mx-[12px]">
          <Button
            size="bg"
            variant="text"
            className="h-[56px] w-full [&_div]:p-0"
          >
            <div className="ml-4 mr-6 flex grow flex-row place-items-center justify-start gap-3 font-bold text-foreground">
              <Icon icon="home" size={24} className="-translate-y-[1px]" />
              <span className="grow text-left">Домашняя страница</span>
              <span>24</span>
            </div>
          </Button>
        </Link>
        <Link href="#" className="mx-[12px]">
          <Button
            size="bg"
            variant="text"
            className="h-[56px] w-full [&_div]:p-0"
          >
            <div className="ml-4 mr-6 flex grow flex-row place-items-center justify-start gap-3 font-bold text-foreground">
              <Icon icon="home" size={24} className="-translate-y-[1px]" />
              <span className="grow text-left">Домашняя страница</span>
              <span>24</span>
            </div>
          </Button>
        </Link>
      </div>
    </>
  );
}
