import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { isDevelopment } from "~/server/api/debug";

export default async function DashboardDebugLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isDevelopment())) notFound();

  return children;
}
