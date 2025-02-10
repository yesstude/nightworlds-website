import { and, eq, gt, isNotNull, lt, or } from "drizzle-orm";
import { db } from "../db";
import { BaseSubscription, subscriptionsTable } from "../db/schema";
import { ClientSafeUser } from "./users";
import { ClientSafeWorld, WorldId, WorldSubscriptionTag } from "./worlds";

export type FreeFeatureAccessPolicy = {
  type: "free";
};
export type SubscriptionFeatureAccessPolicyTag = WorldSubscriptionTag;
export type SubscriptionFeatureAccessPolicy = {
  type: "subscription";
  period: "monthly";
  pricingAfter: { [key: number]: { price: number; trialLength?: number } };
  tag: SubscriptionFeatureAccessPolicyTag;
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

export async function getCurrentSubscription(
  accessPolicy: SubscriptionFeatureAccessPolicy,
  userId: string
) {
  const [subscription] = await db
    .select()
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.userId, userId),
        eq(subscriptionsTable.tag, accessPolicy.tag),
        and(
          isNotNull(subscriptionsTable.startedAt),
          lt(subscriptionsTable.startedAt, new Date())
        ),
        or(
          gt(subscriptionsTable.endedAt, new Date()),
          and(
            isNotNull(subscriptionsTable.frozenAt),
            isNotNull(subscriptionsTable.freezeReason)
          )
        )
      )
    );
  return subscription;
}

export async function getSubscriptionPricingFor(
  accessPolicy: SubscriptionFeatureAccessPolicy,
  userId?: string
) {
  if (!userId) return getSubscriptionPricingAt(accessPolicy);
  const subscription = await getCurrentSubscription(accessPolicy, userId);
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
  finalUser: ClientSafeUser;
  prolongation: {
    from?: Date;
    to?: Date;
    period: SubscriptionFeatureAccessPolicy["period"];
  };
  donation?: number;
  willBeFrozen?: { reason: Exclude<BaseSubscription["freezeReason"], null> };
  price: number;
};

export async function checkoutWorldSubscription(
  payment: WorldSubscriptionPaymentInput
) {
  "use server";
}
