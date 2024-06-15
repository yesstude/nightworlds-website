import { redirect } from "next/navigation";
import { isAuthorized } from "../../../server/api/auth";
import { ReactNode } from "react";
import DashboardWrapper from "../../../components/dashboard/DashboardWrapper";

export default async function DashboardLayout(props: { children: ReactNode }) {
  if (!(await isAuthorized())) return redirect("/auth/signin");

  return <DashboardWrapper>{props.children}</DashboardWrapper>;
}
