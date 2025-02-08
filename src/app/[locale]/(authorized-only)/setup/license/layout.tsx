import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getMeUnsafe } from "~/server/api/sessions";

export default async function SetupLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getMeUnsafe();
  if (user!.nickname) return redirect("/setup/password");

  return children;
}
