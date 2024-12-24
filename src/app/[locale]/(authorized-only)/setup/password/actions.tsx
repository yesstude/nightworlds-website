"use server";

import { redirect } from "next/navigation";
import { setIngamePassword } from "~/server/api/account";

export const setPassword = async (formData: FormData) => {
  const password = formData.get("password")?.toString();
  if (!password) return;

  await setIngamePassword(password);
  redirect("/setup/finish");
};
