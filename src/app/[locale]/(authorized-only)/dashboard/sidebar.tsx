"use client";

import { Logo } from "~/components/logo";
import Link from "~/components/transition/link";
import { Button } from "~/components/ui/button";
import { Icon, IconName } from "~/components/ui/icon";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { usePathname } from "~/i18n/routing";

type SidebarLink = {
  label: string;
  icon: IconName;
  href: string;
};

const links = [
  {
    icon: "home",
    label: "Домашняя страница",
    href: "/dashboard",
  },
  {
    icon: "globe",
    label: "Миры",
    href: "/dashboard/worlds",
  },
] satisfies SidebarLink[];

export default function NavDrawer() {
  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton variant="unset" size="unset" asChild>
              <Logo className="mb-2 ml-2 mt-2" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {links.map((link, i) => (
              <SidebarLinkItem sidebarLink={link} key={i} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {/* <Link href="/dashboard" className="mx-[12px]">
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
      </Link> */}
    </Sidebar>
  );
}

function SidebarLinkItem({ sidebarLink: link }: { sidebarLink: SidebarLink }) {
  const pathname = usePathname();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={pathname == link.href}>
        <Link href={link.href}>
          <div className="ml-4 mr-6 flex grow flex-row place-items-center justify-start gap-3 font-bold text-foreground">
            <Icon
              icon={link.icon}
              size={24}
              className="-translate-y-[1px]"
              fill={pathname == link.href}
            />
            <span className="grow text-left">{link.label}</span>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
