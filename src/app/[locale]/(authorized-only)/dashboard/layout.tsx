import { ReactNode } from "react";
import NavDrawer from "./sidebar";
import LandingFooter from "../../(landing)/footer";
import { getMeUnsafe } from "~/server/api/sessions";
import { redirect } from "next/navigation";
import { TransitionSuspense } from "~/components/transition/transition-provider";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import DashboardAppBar from "./appbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Личный кабинет",
  description: "Панель управления вашим аккаунтом NightWorlds",
};

export default async function DashboardLayout(props: { children: ReactNode }) {
  const user = await getMeUnsafe();
  if (!user!.isSetUp) return redirect("/setup");

  return (
    <SidebarProvider>
      <NavDrawer />
      <SidebarInset>
        <DashboardAppBar />
        <TransitionSuspense className="flex min-h-full grow flex-col place-items-center gap-4 lg:p-4">
          <div className="w-full max-w-full rounded-b-[32px] bg-primary/[.04] px-4 py-8 md:px-8 lg:rounded-t-[32px]">
            {props.children}
          </div>
          <LandingFooter />
        </TransitionSuspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
