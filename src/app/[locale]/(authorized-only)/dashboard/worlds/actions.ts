"use server";

import { and, eq, inArray, lt, or } from "drizzle-orm";
import { SubscriptionFeatureAccessPolicy } from "~/server/api/billing";
import { getMeUnsafe } from "~/server/api/sessions";
import { WorldId, getWorlds } from "~/server/api/worlds";
import { db } from "~/server/db";
import { serversTable, subscriptionsTable } from "~/server/db/schema";

export async function getPersonalizedWorlds() {
  const me = await getMeUnsafe();
  if (!me) throw new Error("Unauthorized");

  const worlds = await getWorlds();
  const servers = await db
    .select()
    .from(serversTable)
    .where(
      and(
        inArray(
          serversTable.worldId as any,
          worlds.map((w) => w.id)
        ),
        or(
          lt(serversTable.startedAt, new Date()),
          eq(serversTable.isPreOrderable, true)
        )
      )
    );
  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.userId, me.id),
        inArray(
          subscriptionsTable.tag,
          worlds
            .filter((w) => w.accessPolicy.type == "subscription")
            .map((w) => (w.accessPolicy as SubscriptionFeatureAccessPolicy).tag)
        )
      )
    );

  return worlds.map((w) => {
    const server = servers.find((s) => s.worldId == w.id);
    const currentSubscription =
      w.accessPolicy.type == "subscription"
        ? subscriptions.find(
            (s) =>
              s.tag == (w.accessPolicy as SubscriptionFeatureAccessPolicy).tag
          )
        : undefined;

    const subscriptionStartTime =
      currentSubscription?.startedAt?.getTime() ?? Date.now();

    const subscription =
      w.accessPolicy.type == "subscription"
        ? {
            price: Object.entries(w.accessPolicy.pricingAfter)
              .filter(([k]) => Number(k) < subscriptionStartTime)!
              .pop()![1].price,
            period: w.accessPolicy.period,
            isPaid: !!currentSubscription,
          }
        : undefined;

    return {
      id: w.id as WorldId,
      name: server?.overwriteWorldName ?? w.name,
      techDesc: w.techDesc,
      description: w.description,
      isAvailable: !!server,
      isFree: w.accessPolicy.type == "free",
      subscription,
      isPreOrderable: server?.isPreOrderable ?? false,
      isPlayable: w.accessPolicy.type == "free" || !!currentSubscription,
    };
  });
}

export type PersonalizedWorld = Awaited<
  ReturnType<typeof getPersonalizedWorlds>
>[number];
