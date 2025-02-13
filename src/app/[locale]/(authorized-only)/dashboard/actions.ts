"use server";

import { getMeUnsafe } from "~/server/api/sessions";

export async function amIAdmin() {
  const me = await getMeUnsafe();
  return me?.isAdmin || false;
}
