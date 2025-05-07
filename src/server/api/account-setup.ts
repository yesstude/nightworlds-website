"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { BaseUser, usersTable } from "../db/schema";
import { getMeUnsafe } from "./sessions";
import { enc, SHA256 } from "crypto-js";

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

  await db
    .update(usersTable)
    .set({ isSetUp: true })
    .where(eq(usersTable.id, me!.id));
}
