"use server";

import { db } from "../db";
import { BaseUser, usersTable, subscriptionsTable, paymentsTable } from "../db/schema";
import { getMeUnsafe } from "./sessions";
import { enc, SHA256 } from "crypto-js";
import { eq, and } from "drizzle-orm";

export type LicenseType = Exclude<BaseUser["licenseType"], null>;
export async function getLicenseType() {
  const me = await getMeUnsafe();
  return me!.licenseType ?? undefined;
}

export async function setLicenseType(licenseType: LicenseType) {
  const me = await getMeUnsafe();
  if (!me) return;

  await db
    .update(usersTable)
    .set({ licenseType })
    .where(eq(usersTable.id, me.id))
    .execute();
}

export type NicknameAvailability =
  | "available"
  | "taken"
  | "licensed"
  | "nonlicensed"
  | "too-short"
  | "too-long"
  | "contains-politics"
  | "invalid";
export async function checkNicknameAvailability(
  nickname: string,
): Promise<NicknameAvailability> {
  nickname = nickname.trim();
  if (!nickname.match(/^[A-Za-z0-9_]*$/)) return "invalid";
  if (nickname.length < 3) return "too-short";
  if (nickname.length > 16) return "too-long";

  const me = await getMeUnsafe();
  if (!me) return "taken";

  if (me.nickname && me.nickname == nickname) return "available";

  const [takenBy] = await db
    .selectDistinct()
    .from(usersTable)
    .where(eq(usersTable.nickname, nickname));
  if (takenBy) return "taken";

  try {
    const res = await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${nickname}`,
    ).then((r) => r.json());

    if (!!res.id && me.licenseType == "offline") return "licensed";
    if (!res.id && me.licenseType != "offline") return "nonlicensed";
  } catch (error) {
    return "available";
  }

  return "available";
}

export async function setNickname(nickname: string) {
  const me = await getMeUnsafe();
  if (me!.nickname) throw new Error("Nickname is already set");
  if ((await checkNicknameAvailability(nickname)) != "available")
    throw new Error("Cannot set this nickname");

  await db
    .update(usersTable)
    .set({ nickname })
    .where(eq(usersTable.id, me!.id));
}

export async function setIngamePassword(password: string) {
  const me = await getMeUnsafe();
  if (password.length < 5) throw new Error("Password is too short");

  const passwordHash = enc.Base64.stringify(SHA256(enc.Utf8.parse(password)));

  await db
    .update(usersTable)
    .set({ passwordHash })
    .where(eq(usersTable.id, me!.id));
}

export async function setAccountSetUp() {
  const me = await getMeUnsafe();
  if (!me) return;

  // Set account as set up
  await db
    .update(usersTable)
    .set({ isSetUp: true })
    .where(eq(usersTable.id, me.id));

  // Check if user has ever had a subscription for medium.basic
  const existingSubscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.userId, me.id),
        eq(subscriptionsTable.tag, "medium.basic")
      )
    );

  // If user has never had a subscription, create a trial
  if (existingSubscriptions.length === 0) {
    const now = new Date();
    const trialEndDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Create the trial subscription
    const [subscription] = await db
      .insert(subscriptionsTable)
      .values({
        userId: me.id,
        tag: "medium.basic",
        startedAt: now,
        shouldEndAt: trialEndDate,
      })
      .$returningId();

    if (subscription) {
      // Create the payment record for the trial
      await db
        .insert(paymentsTable)
        .values({
          type: "subscription",
          subscriptionId: subscription.id,
          userId: me.id,
          provider: "admin",
          amount: 0,
          description: `Бесплатная пробная версия на Medium для @${me.nickname || 'пользователя'}`,
          result: "succeeded",
          closedAt: now,
        });
    }
  }
}
