"use server";

import { and, desc, eq, gt, isNotNull, isNull, lt, or } from "drizzle-orm";
import { getMeUnsafe } from "~/server/api/sessions";
import { db } from "~/server/db";
import {
  paymentMethodsTable,
  paymentsTable,
  subscriptionsTable,
  usersTable,
} from "~/server/db/schema";
import User, { ClientUser } from "~/server/models/User";

export async function getPaymentMethods() {
  const me = await getMeUnsafe();
  if (!me) return [];

  const methods = await me.getPaymentMethods();
  return methods.map((m) => m.getClient());
}

export async function getPayments() {
  const me = await getMeUnsafe();
  if (!me) return [];

  const payments = await db
    .select()
    .from(paymentsTable)
    .leftJoin(
      subscriptionsTable,
      eq(paymentsTable.subscriptionId, subscriptionsTable.id),
    )
    .where(
      or(eq(paymentsTable.userId, me.id), eq(subscriptionsTable.userId, me.id)),
    )
    .orderBy(desc(paymentsTable.createdAt))
    .limit(10)
    .offset(0);

  return payments.map((p) => ({
    id: p.payments.id,
    type: p.payments.type,
    amount: p.payments.amount,
    createdAt: p.payments.createdAt,
    closedAt: p.payments.closedAt,
    description: p.payments.description,
    result: p.payments.result,
    isGifted: p.payments.userId !== me.id,
  }));
}

export async function unlinkPaymentMethod(id: string) {
  const me = await getMeUnsafe();
  if (!me) return;

  const [method] = await db
    .select()
    .from(paymentMethodsTable)
    .where(
      and(
        eq(paymentMethodsTable.id, id),
        eq(paymentMethodsTable.userId, me.id),
      ),
    );
  if (!method) return;

  await db
    .delete(paymentMethodsTable)
    .where(eq(paymentMethodsTable.id, method.id));
}

export async function hadPayments() {
  const payments = await getPayments();

  return payments.length > 0;
}

export async function getSubscriptions() {
  const me = await getMeUnsafe();
  if (!me) return [];

  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.userId, me.id),
        isNotNull(subscriptionsTable.shouldEndAt),
        gt(subscriptionsTable.shouldEndAt, new Date()),
        or(
          isNull(subscriptionsTable.endedAt),
          gt(subscriptionsTable.endedAt, new Date()),
        ),
      ),
    );
  return subscriptions.map((s) => ({
    id: s.id,
    tag: s.tag,
    shouldEndAt: s.shouldEndAt!,
    freezeReason: s.freezeReason,
  }));
}

export async function searchUserByNickname(nickname: string) {
  const me = await getMeUnsafe();

  const [user] = await db
    .selectDistinct()
    .from(usersTable)
    .leftJoin(
      subscriptionsTable,
      and(
        eq(usersTable.id, subscriptionsTable.userId),
        isNotNull(subscriptionsTable.shouldEndAt),
        lt(subscriptionsTable.shouldEndAt, new Date()),
      ),
    )
    .where(eq(usersTable.nickname, nickname.trim()));
  if (!user) return undefined;
  if (user.user.id === me?.id) return undefined;
  if (user.subscriptions) return undefined;
  return {
    id: user.user.id,
    nickname: user.user.nickname!,
    avatarUrl: User.getDefaultAvatarUrl(user.user.nickname ?? undefined),
  } satisfies ClientUser;
}
