import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getMe } from "~/server/api/sessions";

export default async function SetupLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getMe();
  if (!user!.licenseType) return redirect("/setup/license");
  if (!user!.nickname) return redirect("/setup/nickname");
  if (user!.licenseType == "online") return redirect("/setup/finish");
  if (user!.passwordHash) return redirect("/setup/finish");

  return children;
}
