import { eq } from "drizzle-orm";
import { db } from "../db";
import { BaseUser, usersTable } from "../db/schema";
import { getMeUnsafe } from "./sessions";

export async function getUser(id?: string) {
  if (!id) return (await getMeUnsafe()) ?? undefined;
  return (
    await db.selectDistinct().from(usersTable).where(eq(usersTable.id, id))
  )[0];
}

export type ClientSafeUser = {
  id: string;
  nickname: string | null;
  avatarUrl: string;
};

export async function getClientSafeUser(
  user?: string | BaseUser | ClientSafeUser
) {
  "use client";

  const result = !user || typeof user == "string" ? await getUser(user) : user;
  if (!result) return undefined;
  return {
    id: result.id,
    nickname: result?.nickname ?? null,
    avatarUrl: `https://minotar.net/helm/${
      result?.nickname ?? "MHF_Steve"
    }/128.png`,
  } satisfies ClientSafeUser;
}
