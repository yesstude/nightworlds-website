import { and, eq, gt, isNotNull, isNull, lt, or } from "drizzle-orm";
import { db } from "../db";
import {
  BaseSubscription,
  PaymentProvider,
  paymentMethodsTable,
  paymentsTable,
  subscriptionsTable,
} from "../db/schema";
import { ClientUser } from "../models/User";
import yookassa from "../yoocheckout";
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
          isNull(subscriptionsTable.endedAt),
          gt(subscriptionsTable.endedAt, new Date())
        ),
        gt(subscriptionsTable.shouldEndAt, new Date()),
        and(
          isNotNull(subscriptionsTable.frozenAt),
          isNotNull(subscriptionsTable.freezeReason)
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
  paymentMethodId?: string;
  email?: string;
};
export type WorldSubscriptionPaymentPreview = {
  world: ClientSafeWorld;
  giftToUser?: ClientUser;
  finalUser: ClientUser;
  prolongation: {
    from?: Date;
    to?: Date;
    period: SubscriptionFeatureAccessPolicy["period"];
  };
  donation?: number;
  willBeFrozen?: { reason: Exclude<BaseSubscription["freezeReason"], null> };
  price: number;
};

export async function handlePaymentUpdate(
  providerId: PaymentProvider,
  externalId: string
) {
  const [payment] = await db
    .select()
    .from(paymentsTable)
    .where(
      and(
        eq(paymentsTable.provider, providerId),
        eq(paymentsTable.externalId, externalId)
      )
    );
  if (!payment) return;
  if (payment.closedAt && payment.closedAt.getTime() < Date.now()) return;

  let status: "succeeded" | "canceled" | "waiting_for_capture" | "pending" =
    "canceled";
  if (providerId == "yookassa") {
    const yoopayment = await yookassa.getPayment(externalId);

    if (yoopayment.payment_method.saved) {
      var [method]: { id: string }[] = await db
        .select()
        .from(paymentMethodsTable)
        .where(
          and(
            eq(paymentMethodsTable.provider, providerId),
            eq(paymentMethodsTable.externalId, yoopayment.payment_method.id)
          )
        );
      if (!method)
        [method] = await db
          .insert(paymentMethodsTable)
          .values({
            userId: payment.userId,
            provider: providerId,
            externalId: yoopayment.payment_method.id,
            card: yoopayment.payment_method.card
              ? {
                  first6: yoopayment.payment_method.card.first6,
                  last4: yoopayment.payment_method.card.last4,
                  expiry_month: yoopayment.payment_method.card.expiry_month,
                  expiry_year: yoopayment.payment_method.card.expiry_year,
                }
              : undefined,
          })
          .$returningId();
    }
    status = yoopayment.status;
  } else if (providerId == "admin") {
    status = "succeeded";
  }

  if (payment.type == "subscription" && payment.subscriptionId) {
    const [subscription] = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.id, payment.subscriptionId));
    if (status === "canceled")
      if (!subscription?.startedAt)
        await db
          .delete(subscriptionsTable)
          .where(eq(subscriptionsTable.id, subscription!.id));
    if (status === "succeeded") {
      const toAdd = 1000 * 60 * 60 * 24 * 30;
      await db
        .update(subscriptionsTable)
        .set(
          subscription!.shouldEndAt
            ? {
                shouldEndAt: new Date(
                  subscription!.shouldEndAt.getTime() + toAdd
                ),
                autoprolongWith:
                  subscription!.userId === payment.userId
                    ? method?.id
                    : undefined,
              }
            : {
                startedAt: new Date(),
                shouldEndAt: new Date(Date.now() + toAdd),
                autoprolongWith:
                  subscription!.userId === payment.userId
                    ? method?.id
                    : undefined,
              }
        )
        .where(eq(subscriptionsTable.id, subscription!.id));
    }
  }

  if (status === "succeeded" || status === "canceled")
    await db
      .update(paymentsTable)
      .set({
        result: status,
        closedAt: new Date(),
        savedMethodId: method?.id,
      })
      .where(eq(paymentsTable.id, payment.id));
}
