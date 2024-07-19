import { redirect } from "next/navigation";
import { isAuthorized, isSetupFinished } from "../../../server/api/auth";
import { ReactNode } from "react";
import DashboardWrapper from "../../../components/dashboard/DashboardWrapper";
import { headers } from "next/headers";

export default async function DashboardLayout(props: { children: ReactNode }) {
  const pathname = headers().get("x-pathname");

  if (!(await isAuthorized()))
    return redirect("/auth/signin?redirect=" + pathname);
  if (!(await isSetupFinished())) return redirect("/setup");

  return <DashboardWrapper>{props.children}</DashboardWrapper>;
}
