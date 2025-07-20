"use client";

import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { useSidebar } from "~/components/ui/sidebar";

export default function DashboardAppBar() {
  const sidebar = useSidebar();

  return (
    <>
      <div className="fixed z-50 w-full rounded-b-[24px] bg-background lg:hidden print:relative">
        <div className="flex h-[80px] w-full place-items-center gap-2 rounded-b-[24px] bg-secondary/5 px-4 shadow-md">
          <Button onClick={sidebar.toggleSidebar} variant="text" size="icon">
            <Icon icon="menu" />
          </Button>
          <Logo />
        </div>
      </div>
      <div className="min-h-[70px] lg:hidden print:hidden" />
    </>
  );
}
