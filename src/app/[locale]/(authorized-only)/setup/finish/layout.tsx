import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getCurrentSession } from "~/server/api/sessions";

export default async function SetupLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await getCurrentSession();
  if (!user!.licenseType) return redirect("/setup/license");
  if (!user!.nickname) return redirect("/setup/nickname");
  if (!user!.passwordHash && user!.licenseType != "online")
    return redirect("/setup/nickname");

  return children;
}
