"use server";

import { and, eq, gt, inArray, isNull, lt, or, sql } from "drizzle-orm";
import { daysUntil } from "~/lib/utils";
import { SubscriptionFeatureAccessPolicy } from "~/server/api/billing";
import { getMeUnsafe } from "~/server/api/sessions";
import { WorldId, getWorlds } from "~/server/api/worlds";
import { db } from "~/server/db";
import { serversTable, subscriptionsTable } from "~/server/db/schema";

export async function getPersonalizedWorlds() {
  const me = await getMeUnsafe();
  if (!me) throw new Error("Unauthorized");

  const worlds = await getWorlds();
  const now = new Date();
  const nowMs = now.getTime();

  const servers = await db
    .select()
    .from(serversTable)
    .where(
      and(
        inArray(serversTable.worldId as any, worlds.map((w) => w.id)),
        or(
          lt(serversTable.startedAt, now),
          eq(serversTable.isPreOrderable, true),
        ),
      ),
    );

  const subscriptionWorlds = worlds.filter(
    (w) => w.accessPolicy.type === "subscription"
  );
  const subscriptionTags = subscriptionWorlds.map(
    (w) => (w.accessPolicy as SubscriptionFeatureAccessPolicy).tag
  );

  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.userId, me.id),
        inArray(subscriptionsTable.tag, subscriptionTags),
        lt(subscriptionsTable.startedAt, now),
        gt(subscriptionsTable.shouldEndAt, now),
        or(
          gt(subscriptionsTable.endedAt, now),
          isNull(subscriptionsTable.endedAt),
        ),
      ),
    );

  let userSubscriptionCountsByTag: Record<string, number> = {};
  if (subscriptionTags.length > 0) {
    const counts = await db
      .select({ tag: subscriptionsTable.tag, count: sql`COUNT(*)`.mapWith(Number) })
      .from(subscriptionsTable)
      .where(and(
        eq(subscriptionsTable.userId, me.id),
        inArray(subscriptionsTable.tag, subscriptionTags),
      ))
      .groupBy(subscriptionsTable.tag);
    userSubscriptionCountsByTag = Object.fromEntries(counts.map(row => [row.tag, row.count]));
  }

  function getSubscriptionInfo(
    w: typeof worlds[number],
    currentSubscription: typeof subscriptions[number] | undefined,
  ) {
    if (w.accessPolicy.type !== "subscription") return undefined;

    const subscriptionStartTime =
      currentSubscription?.startedAt?.getTime() ?? nowMs;

    const pricing = Object.entries(w.accessPolicy.pricingAfter)
      .filter(([k]) => Number(k) < subscriptionStartTime)
      .pop();

    return {
      price: pricing?.[1].price,
      period: w.accessPolicy.period,
      isPaid: !!currentSubscription,
      isRenewable: currentSubscription?.shouldEndAt
        ? daysUntil(currentSubscription.shouldEndAt) <= 7 &&
        daysUntil(currentSubscription.shouldEndAt) >= 0
        : false,
    };
  }

  return worlds.map((w) => {
    const server = servers.find((s) => s.worldId == w.id);
    const currentSubscription =
      w.accessPolicy.type === "subscription"
        ? subscriptions.find(
          (s) =>
            s.tag ===
            (w.accessPolicy as SubscriptionFeatureAccessPolicy).tag
        )
        : undefined;

    const userEverHadSubscription =
      w.accessPolicy.type === "subscription"
        ? (userSubscriptionCountsByTag[(w.accessPolicy as SubscriptionFeatureAccessPolicy).tag] ?? 0) > 0
        : false;

    let isTrialAvailable = false;
    let trialLength = 0;
    if (w.accessPolicy.type === "subscription") {
      const pricing = Object.entries(w.accessPolicy.pricingAfter)
        .filter(([k]) => Number(k) < nowMs)
        .pop();
      trialLength = pricing?.[1]?.trialLength ?? 0;
      isTrialAvailable =
        !!trialLength && trialLength > 0 && !userEverHadSubscription;
    }

    return {
      id: w.id as WorldId,
      name: server?.overwriteWorldName ?? w.name,
      techDesc: w.techDesc,
      description: w.description,
      isAvailable: !!server,
      isFree: w.accessPolicy.type === "free",
      subscription: getSubscriptionInfo(w, currentSubscription),
      isPreOrderable: server?.isPreOrderable ?? false,
      isPlayable:
        w.accessPolicy.type === "free" || !!currentSubscription,
      isTrialAvailable,
      trialLength,
    };
  });
}

export type PersonalizedWorld = Awaited<
  ReturnType<typeof getPersonalizedWorlds>
>[number];
