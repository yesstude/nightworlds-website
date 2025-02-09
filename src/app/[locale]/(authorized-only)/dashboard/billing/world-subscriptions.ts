"use server";

import { getMeUnsafe } from "../../../../../server/api/sessions";
import { getClientSafeUser, getUser } from "../../../../../server/api/users";
import {
  getClientSafeWorld,
  getWorld,
  getWorldAvailability,
} from "../../../../../server/api/worlds";
import {
  WorldSubscriptionPaymentInput,
  WorldSubscriptionPaymentPreview,
  getSubscriptionPricingFor,
} from "../../../../../server/api/billing";

export async function previewWorldSubscription(
  payment: WorldSubscriptionPaymentInput
): Promise<WorldSubscriptionPaymentPreview> {
  const me = await getMeUnsafe();
  if (!me) throw new Error("Unauthorized");

  const donation =
    Math.min(Math.max(0, payment.donation ?? 0), 5000000) || undefined;

  const [availability, newName] = await getWorldAvailability(payment.worldId);
  if (availability == "none")
    throw new Error("The world is not available for purchase");
  const serverWorld = await getWorld(payment.worldId);
  if (serverWorld.accessPolicy.type != "subscription")
    throw new Error("The world billing type is not a subscription");
  let world = await getClientSafeWorld(serverWorld);
  if (newName) world.name = newName;

  const user = payment.giftToUserId
    ? (await getUser(payment.giftToUserId))!
    : me;

  // let period = serverWorld.accessPolicy.period;
  const willBeFrozen =
    availability == "preorder" ? ({ reason: "preorder" } as const) : undefined;

  let price = (
    await getSubscriptionPricingFor(
      serverWorld.accessPolicy,
      payment.giftToUserId ? undefined : user.id
    )
  ).price;
  if (payment.giftToUserId) price *= 1.2;
  price += donation ?? 0;

  const giftToUser = payment.giftToUserId
    ? await getClientSafeUser(user)
    : undefined;

  return {
    world,
    giftToUser,
    willBeFrozen,
    prolongation: {
      period: serverWorld.accessPolicy.period,
    },
    donation,
    price,
  };
}
