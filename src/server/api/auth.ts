"use server";

import { db } from "../db";
import { accountsTable, usersTable } from "../db/schema";
import { authorizeSession, getSessionUnsafe } from "./sessions";
import { enc, HmacSHA256, SHA256 } from "crypto-js";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { env } from "~/env/server.mjs";

export type TelegramAuthData = {
  auth_date: number;
  id: number;
  photo_url?: string;
  username?: string;
  first_name: string;
  last_name?: string;
  hash: string;
};

export async function getTelegramBotId() {
  return "6116074521"
  return env.TELEGRAM_BOT_TOKEN.split(":")[0]!;
}

export async function checkTelegramDataIntegrity(data: TelegramAuthData) {
  let str = Object.entries(data)
    .filter(([key]) => key != "hash")
    .map(([key, val]) => `${key}=${val}`)
    .sort()
    .join("\n");
  const newhash = enc.Hex.stringify(
    HmacSHA256(
      enc.Utf8.parse(str),
      SHA256(enc.Utf8.parse(env.TELEGRAM_BOT_TOKEN)),
    ),
  );
  return data.hash == newhash;
}

export async function authWithTelegramData(data: TelegramAuthData) {
  const session = await getSessionUnsafe();
  if (!(await checkTelegramDataIntegrity(data)))
    return redirect("?error=integrity");

  const [existing] = await db
    .select()
    .from(accountsTable)
    .where(
      and(
        eq(accountsTable.type, "telegram"),
        eq(accountsTable.identifier, data.id.toString()),
      ),
    )
    .leftJoin(usersTable, eq(usersTable.id, accountsTable.user));
  if (existing && existing.account && existing.user) {
    await authorizeSession(session!.id, existing.user.id);
    return redirect("/dashboard");
  }

  const userId = await db.transaction(async (tx) => {
    const [user] = await tx.insert(usersTable).values({}).$returningId();
    if (!user) tx.rollback();
    else {
      await tx.insert(accountsTable).values({
        type: "telegram",
        user: user.id,
        identifier: data.id.toString(),
        secondaryData: data,
      });
    }
    return user?.id;
  });
  if (!userId) return redirect("?error=server");

  await authorizeSession(session!.id, userId);
  return redirect("/dashboard");
}
