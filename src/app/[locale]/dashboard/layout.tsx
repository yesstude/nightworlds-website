import { redirect } from "next/navigation";
import { isAuthorized, isSetupFinished } from "../../../server/api/auth";
import { ReactNode } from "react";
import DashboardWrapper from "../../../components/dashboard/DashboardWrapper";

export default async function DashboardLayout(props: { children: ReactNode }) {
  if (!(await isAuthorized())) return redirect("/auth/signin");
  if (!(await isSetupFinished())) return redirect("/setup");

  return <DashboardWrapper>{props.children}</DashboardWrapper>;
}
