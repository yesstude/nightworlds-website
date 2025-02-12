import { NextRequest } from "next/server";
import { Payment as YooPayment } from "@a2seven/yoo-checkout";
import yookassa from "~/server/yoocheckout";
import { db } from "~/server/db";
import {
  paymentMethodsTable,
  paymentsTable,
  subscriptionsTable,
} from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    var body: YooPaymentNotification = await req.json();
    if (!body || !body.event) return new Response(null, { status: 400 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 400 });
  }

  if (!body.event.startsWith("payment."))
    return new Response(null, { status: 200 });

  await handlePaymentUpdate(body.object.id);
  return new Response(null, { status: 200 });
}

async function handlePaymentUpdate(externalId: string) {
  const [payment] = await db
    .select()
    .from(paymentsTable)
    .where(
      and(
        eq(paymentsTable.provider, "yookassa"),
        eq(paymentsTable.externalId, externalId)
      )
    );
  if (!payment) return;
  if (payment.closedAt && payment.closedAt.getTime() < Date.now()) return;

  const yoopayment = await yookassa.getPayment(externalId);

  if (yoopayment.payment_method.saved) {
    var [method]: { id: string }[] = await db
      .select()
      .from(paymentMethodsTable)
      .where(
        and(
          eq(paymentMethodsTable.provider, "yookassa"),
          eq(paymentMethodsTable.externalId, yoopayment.payment_method.id)
        )
      );
    if (!method)
      [method] = await db
        .insert(paymentMethodsTable)
        .values({
          userId: payment.userId,
          provider: "yookassa",
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

  if (payment.type == "subscription" && payment.subscriptionId) {
    const [subscription] = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.id, payment.subscriptionId));
    if (yoopayment.status === "canceled")
      await db
        .delete(subscriptionsTable)
        .where(eq(subscriptionsTable.id, subscription!.id));
    if (yoopayment.status === "succeeded") {
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

  if (yoopayment.status === "succeeded" || yoopayment.status === "canceled")
    await db
      .update(paymentsTable)
      .set({
        result: yoopayment.status,
        closedAt: new Date(),
        savedMethodId: method?.id,
      })
      .where(eq(paymentsTable.id, payment.id));
}

export type YooPaymentNotification = {
  type: "notification";
  event:
    | "payment.waiting_for_capture"
    | "payment.succeeded"
    | "payment.canceled";
  object: YooPayment;
};
