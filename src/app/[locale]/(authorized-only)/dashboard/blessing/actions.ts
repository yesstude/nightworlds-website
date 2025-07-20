"use server";

import { eq } from "drizzle-orm";
import { getMeOrThrow } from "~/server/api/sessions";
import { db } from "~/server/db";
import { blessingProfilesTable } from "~/server/db/schema";

export async function createBlessingProfile() {
  const me = await getMeOrThrow();

  try {
    await db.insert(blessingProfilesTable).values({
      userId: me.id,
    });
  } catch (error) {
    console.warn(
      `User ${me.id} tried to create blessing profile, but it already exists`,
    );
  }
}

export async function getBlessingProfile() {
  const me = await getMeOrThrow();

  const [profile] = await db
    .select()
    .from(blessingProfilesTable)
    .where(eq(blessingProfilesTable.userId, me.id));

  return profile;
}
