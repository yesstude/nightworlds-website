"use server";

import { getCurrentSubscription, SubscriptionFeatureAccessPolicy } from "~/server/api/billing";
import { getMeUnsafe } from "~/server/api/sessions";
import { getWorld } from "~/server/api/worlds";

export async function amIAdmin() {
  const me = await getMeUnsafe();
  return me?.isAdmin || false;
}

export async function hasMediumSubscription() {
  const me = await getMeUnsafe();

  const subscription = await getCurrentSubscription(
    (await getWorld("medium")).accessPolicy as SubscriptionFeatureAccessPolicy,
    me!.id,
  );

  return !!subscription;
}