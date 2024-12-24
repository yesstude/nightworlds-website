import { ReactNode } from "react";
import NavDrawer from "./navdrawer";
import LandingFooter from "../../(landing)/footer";
import { getMe } from "~/server/api/sessions";
import { redirect } from "next/navigation";

export default async function DashboardLayout(props: { children: ReactNode }) {
  const user = await getMe();
  if (!user!.isSetUp) return redirect("/setup");

  return (
    <div className="flex min-h-full flex-row">
      <NavDrawer />
      <div className="flex min-h-full grow flex-col place-items-center gap-4 lg:p-4">
        <div className="w-full max-w-full rounded-b-[32px] bg-foreground/5 p-8 lg:rounded-t-[32px]">
          {props.children}
        </div>
        {/* <div className="min-h-full w-full max-w-full">{props.children}</div> */}
        <LandingFooter />
      </div>
    </div>
  );
}
