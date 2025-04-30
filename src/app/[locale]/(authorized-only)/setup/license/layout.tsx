import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getCurrentSession } from "~/server/api/sessions";

export default async function SetupLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await getCurrentSession();
  if (user!.nickname) return redirect("/setup/password");

  return children;
}
