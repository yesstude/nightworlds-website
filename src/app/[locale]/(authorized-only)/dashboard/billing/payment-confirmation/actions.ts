"use server";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { BasePayment, paymentsTable } from "~/server/db/schema";

export async function checkPaymentStatus(
  id: string
): Promise<{ status: BasePayment["result"]; message?: string }> {
  const [payment] = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.id, id));
  if (!payment)
    return { status: "canceled", message: "Платежа не существует." };
  return { status: payment.result };
}
