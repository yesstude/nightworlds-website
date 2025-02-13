import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { getMeUnsafe } from "~/server/api/sessions";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getMeUnsafe();
  if (!user?.isAdmin) notFound();

  return children;
}
