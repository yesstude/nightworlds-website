"use server";

import { cookies } from "next/headers";

export default async function setCallbackUrl(callbackUrl: string) {
  cookies().set("auth.callback-url", callbackUrl);
}
