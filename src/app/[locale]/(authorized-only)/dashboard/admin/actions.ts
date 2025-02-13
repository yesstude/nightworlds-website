"use server";

import { desc, eq } from "drizzle-orm";
import { getMeUnsafe } from "~/server/api/sessions";
import { db } from "~/server/db";
import { accountsTable, usersTable } from "~/server/db/schema";
import User from "~/server/models/User";

async function getMe() {
  const me = await getMeUnsafe();
  if (!me?.isAdmin) {
    throw new Error("Not authorized");
  }
  return me!;
}

export async function getUsers(page: number = 0, pageSize: number = 20) {
  const me = await getMe();

  const users = await db
    .select()
    .from(usersTable)
    .leftJoin(accountsTable, eq(usersTable.id, accountsTable.user))
    .orderBy(desc(usersTable.registeredAt))
    .offset(page * pageSize)
    .limit(pageSize);
  return users.map((u) => ({
    ...u.user,
    passwordHash: undefined,
    avatarUrl: User.getDefaultAvatarUrl(u.user.nickname ?? undefined),
    account: `${u.account?.type ?? "none"}: ${
      (u.account?.secondaryData as any).username ??
      (u.account?.secondaryData as any).first_name ??
      "unknown"
    }`,
  }));
}
