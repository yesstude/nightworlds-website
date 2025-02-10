"use server";

import { and, desc, eq, or } from "drizzle-orm";
import { getMeUnsafe } from "~/server/api/sessions";
import { db } from "~/server/db";
import {
  paymentMethodsTable,
  paymentsTable,
  subscriptionsTable,
} from "~/server/db/schema";

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
      eq(paymentsTable.subscriptionId, subscriptionsTable.id)
    )
    .where(
      or(eq(paymentsTable.userId, me.id), eq(subscriptionsTable.userId, me.id))
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
      and(eq(paymentMethodsTable.id, id), eq(paymentMethodsTable.userId, me.id))
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
