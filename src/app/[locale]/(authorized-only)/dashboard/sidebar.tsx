"use client";

import { amIAdmin } from "./actions";
import { hadPayments } from "./billing/actions";
import { useTranslations } from "~/i18n/client";
import { Logo } from "~/components/logo";
import { useTransitions } from "~/components/transition/transition-provider";
import { Icon, IconName } from "~/components/ui/icon";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { useIsDevelopment } from "~/hooks/debug";
import { useAwait } from "~/hooks/use-await";
import { usePathname, useRouter } from "next/navigation";

type SidebarLink = {
  label: string;
  icon: IconName;
  href: string;
  doShow?: () => boolean;
};

export default function NavDrawer() {
  const isDevelopment = useIsDevelopment();
  const showBilling = useAwait(hadPayments);
  const isAdmin = useAwait(amIAdmin);

  let links = [
    {
      icon: "home",
      label: "home",
      href: "/dashboard",
    },
    {
      icon: "globe",
      label: "worlds",
      href: "/dashboard/worlds",
    },
    {
      icon: "credit_card",
      label: "billing",
      href: "/dashboard/billing",
      doShow: () => showBilling,
    },
    {
      icon: "admin_panel_settings",
      label: "admin",
      href: "/dashboard/admin",
      doShow: () => !!isAdmin,
    },
    {
      icon: "bug_report",
      label: "debug",
      href: "/dashboard/debug",
      doShow: () => isDevelopment,
    },
  ] as SidebarLink[];

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
            {links
              .filter((v) => (v?.doShow ? v?.doShow() : true))
              .map((link, i) => (
                <SidebarLinkItem
                  sidebarLink={link}
                  key={i}
                  index={i}
                  hrefs={links.map((v) => v.href)}
                />
              ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function SidebarLinkItem({
  sidebarLink: link,
  index,
  hrefs,
}: {
  sidebarLink: SidebarLink;
  index: number;
  hrefs: string[];
}) {
  const sidebar = useSidebar();
  const pathname = "/" + usePathname().split("/").slice(2).join("/");
  const transitions = useTransitions()!;
  const router = useRouter();

  const { t } = useTranslations("dashboard");

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="transition-[background] duration-500"
        asChild
        isActive={pathname == link.href}
      >
        <div
          className="flex grow cursor-pointer flex-row place-items-center justify-start gap-3 pl-4 pr-6 font-medium data-[active=true]:cursor-default data-[active=true]:font-bold [&_*]:text-foreground"
          onClick={() => {
            if (pathname == link.href) return;
            setTimeout(
              () => {
                const currentIndex = hrefs
                  .map((v, i) => (pathname == v ? i : undefined))
                  .find((v) => typeof v == "number");

                const t =
                  typeof currentIndex != "undefined" && currentIndex > index
                    ? transitions.emphasizedFadeDown
                    : transitions.emphasizedFadeUp;

                t().then(() => router.push(link.href));
              },
              sidebar.isMobile ? 200 : 0,
            );
            if (sidebar.isMobile) sidebar.setOpenMobile(false);
          }}
        >
          <Icon
            icon={link.icon}
            size={24}
            className="-translate-y-[1px]"
            fill={pathname == link.href}
          />
          <span className="grow text-left">{t(`navlinks.${link.label}`)}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
