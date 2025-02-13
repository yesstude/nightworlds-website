import { Payment as YooPayment } from "@a2seven/yoo-checkout";
import { NextRequest } from "next/server";
import { handlePaymentUpdate } from "~/server/api/billing";

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

  await handlePaymentUpdate("yookassa", body.object.id);
  return new Response(null, { status: 200 });
}

export type YooPaymentNotification = {
  type: "notification";
  event:
    | "payment.waiting_for_capture"
    | "payment.succeeded"
    | "payment.canceled";
  object: YooPayment;
};
