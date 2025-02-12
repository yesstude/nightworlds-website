import { eq } from "drizzle-orm";
import { db } from "../db";
import { BaseUser, usersTable } from "../db/schema";
import { getMeUnsafe } from "./sessions";
import User, { ClientUser } from "../models/User";

export async function getUser(id?: string) {
  if (!id) return (await getMeUnsafe()) ?? undefined;
  return (
    await db.selectDistinct().from(usersTable).where(eq(usersTable.id, id))
  )[0];
}

export async function getClientSafeUser(user?: string | BaseUser | ClientUser) {
  "use client";

  const result = !user || typeof user == "string" ? await getUser(user) : user;
  if (!result) return undefined;
  return {
    id: result.id,
    nickname: result?.nickname ?? (null as any),
    avatarUrl: User.getDefaultAvatarUrl(result.id),
  } satisfies ClientUser;
}
