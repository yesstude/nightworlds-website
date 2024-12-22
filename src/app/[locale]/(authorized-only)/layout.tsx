import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getMe } from "~/server/api/sessions";

export default async function AuthorizedOnly(props: { children: ReactNode }) {
  const user = await getMe();
  if (!user) return redirect("/signin");

  return props.children;
}
