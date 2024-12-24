"use server";

import { redirect } from "next/navigation";
import { setNickname } from "~/server/api/account";

export const setNicknameAction = async (formData: FormData) => {
  const nickname = formData.get("nickname")?.toString();
  if (!nickname) return;

  await setNickname(nickname);
  redirect("/setup/password");
};
