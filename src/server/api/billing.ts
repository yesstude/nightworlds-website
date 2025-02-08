import { and, eq, gt, isNotNull, lt, or } from "drizzle-orm";
import { db } from "../db";
import { BaseSubscription, subscriptionsTable } from "../db/schema";
import { getMeUnsafe } from "./sessions";
import { ClientSafeUser, getClientSafeUser, getUser } from "./users";
import {
  ClientSafeWorld,
  WorldId,
  getClientSafeWorld,
  getWorld,
  getWorldAvailability,
} from "./worlds";

export type FreeFeatureAccessPolicy = {
  type: "free";
};
export type SubscriptionFeatureAccessPolicy = {
  type: "subscription";
  period: "monthly";
  pricingAfter: { [key: number]: { price: number; trialLength?: number } };
};

export async function getSubscriptionPricingAt(
  accessPolicy: SubscriptionFeatureAccessPolicy,
  date: Date = new Date()
) {
  return Object.entries(accessPolicy.pricingAfter)
    .filter(([k]) => Number(k) < date.getTime())
    .sort(([a], [b]) => Number(b) - Number(a))
    .at(0)![1];
}

export async function getSubscriptionPricingFor(
  accessPolicy: SubscriptionFeatureAccessPolicy,
  userId?: string
) {
  if (!userId) return getSubscriptionPricingAt(accessPolicy);
  const subscription = (
    await db
      .select()
      .from(subscriptionsTable)
      .where(
        and(
          eq(subscriptionsTable.userId, userId),
          lt(subscriptionsTable.startedAt, new Date()),
          or(
            gt(subscriptionsTable.endedAt, new Date()),
            and(
              isNotNull(subscriptionsTable.frozenAt),
              isNotNull(subscriptionsTable.freezeReason)
            )
          )
        )
      )
  )[0];
  return getSubscriptionPricingAt(
    accessPolicy,
    subscription?.startedAt ?? new Date()
  );
}

export type ServerDependentWorldAccessPolicy = {
  type: "server-dependent";
};

export type WorldAccessPolicy =
  | FreeFeatureAccessPolicy
  | ServerDependentWorldAccessPolicy
  | SubscriptionFeatureAccessPolicy;

export type FeatureAccessPolicy = WorldAccessPolicy;

export type WorldSubscriptionPaymentInput = {
  worldId: WorldId;
  donation?: number;
  giftToUserId?: string;
};
export type WorldSubscriptionPaymentPreview = {
  world: ClientSafeWorld;
  giftToUser?: ClientSafeUser;
  prolongation?: {
    from?: Date;
    to: Date;
    period: SubscriptionFeatureAccessPolicy["period"];
  };
  willBeFrozen?: { reason: Exclude<BaseSubscription["freezeReason"], null> };
  price: number;
};

export async function previewWorldSubscription(
  payment: WorldSubscriptionPaymentInput
): Promise<WorldSubscriptionPaymentPreview> {
  "use server";

  const me = await getMeUnsafe();
  if (!me) throw new Error("Unauthorized");

  const availability = await getWorldAvailability(payment.worldId);
  if (availability == "none")
    throw new Error("The world is not available for purchase");
  const serverWorld = await getWorld(payment.worldId);
  if (serverWorld.accessPolicy.type != "subscription")
    throw new Error("The world billing type is not a subscription");
  const world = await getClientSafeWorld(serverWorld);

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
  price += payment.donation ?? 0;

  const giftToUser = payment.giftToUserId
    ? await getClientSafeUser(user)
    : undefined;

  return {
    world,
    giftToUser,
    willBeFrozen,
    price,
  };
}

export async function checkoutWorldSubscription(
  payment: WorldSubscriptionPaymentInput
) {
  "use server";
}
