"use server";

import { checkNickname } from "../../../../server/api/accountSetup";

export default async function checkNick(_: any, data: FormData) {
  const nickname = data.get("nickname")!.toString();
  const check = await checkNickname(nickname);

  return {
    nickname,
    available: check.readyToUse,
    error: check.tooShort
      ? "length"
      : check.invalid
      ? "format"
      : check.occupied
      ? "occupied"
      : undefined,
  };
}
