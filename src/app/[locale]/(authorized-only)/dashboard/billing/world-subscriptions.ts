"use server";

import {
  WorldSubscriptionPaymentInput,
  WorldSubscriptionPaymentPreview,
  getCurrentSubscription,
  getSubscriptionPricingFor,
  handlePaymentUpdate,
} from "../../../../../server/api/billing";
import { getMeUnsafe } from "../../../../../server/api/sessions";
import { getClientSafeUser } from "../../../../../server/api/users";
import {
  getClientSafeWorld,
  getWorld,
  getWorldAvailability,
} from "../../../../../server/api/worlds";
import { IItemWithoutData } from "@a2seven/yoo-checkout";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { env } from "~/env/server.mjs";
import { db } from "~/server/db";
import {
  paymentMethodsTable,
  paymentsTable,
  subscriptionsTable,
} from "~/server/db/schema";
import User from "~/server/models/User";
import yookassa from "~/server/yoocheckout";

export async function previewWorldSubscription(
  payment: WorldSubscriptionPaymentInput,
): Promise<WorldSubscriptionPaymentPreview> {
  const me = await getMeUnsafe();
  if (!me) throw new Error("Unauthorized");

  const donation =
    Math.min(Math.max(0, payment.donation ?? 0), 5000000) || undefined;

  const [availability, newName] = await getWorldAvailability(payment.worldId);
  if (availability == "none")
    throw new Error("The world is not available for purchase");
  const serverWorld = await getWorld(payment.worldId);
  if (serverWorld.accessPolicy.type != "subscription")
    throw new Error("The world billing type is not a subscription");
  let world = await getClientSafeWorld(serverWorld);
  if (newName) world.name = newName;

  const user = payment.giftToUserId
    ? (await User.getById(payment.giftToUserId))!
    : me;
  const finalUser = (await getClientSafeUser(user))!;

  // let period = serverWorld.accessPolicy.period;
  const willBeFrozen =
    availability == "preorder" ? ({ reason: "preorder" } as const) : undefined;

  let price = (
    await getSubscriptionPricingFor(
      serverWorld.accessPolicy,
      payment.giftToUserId ? undefined : user.id,
    )
  ).price;
  if (payment.giftToUserId) price *= 1.2;
  price += donation ?? 0;

  price = Math.floor(price);

  const giftToUser = payment.giftToUserId ? user.getClient() : undefined;

  return {
    world,
    giftToUser,
    finalUser,
    willBeFrozen,
    prolongation: {
      period: serverWorld.accessPolicy.period,
    },
    donation,
    price,
  };
}

export async function payWorldSubscription(
  input: WorldSubscriptionPaymentInput,
  price: number,
) {
  const me = await getMeUnsafe();
  if (!me) throw new Error("Unauthorized");

  const data = await previewWorldSubscription(input);
  if (data.price != price)
    throw new Error(`Payment data is invalid, ${data.price} != ${price}`);

  const reciever = data.finalUser;
  if (!reciever) throw new Error("User not found");

  if (input.paymentMethodId)
    var [paymentMethod] = await db
      .select()
      .from(paymentMethodsTable)
      .where(
        and(
          eq(paymentMethodsTable.userId, me.id),
          eq(paymentMethodsTable.id, input.paymentMethodId),
        ),
      );

  const world = await getWorld(input.worldId);

  const { url, paymentId } = await db.transaction(async (tx) => {
    if (world.accessPolicy.type != "subscription")
      throw new Error("The world billing type is not a subscription");

    let currentSub: { id: string } | undefined = await getCurrentSubscription(
      world.accessPolicy,
      reciever.id,
    );
    if (!currentSub) {
      [currentSub] = await tx
        .insert(subscriptionsTable)
        .values({
          userId: reciever.id,
          tag: world.accessPolicy.tag,
          frozenAt: data.willBeFrozen ? new Date() : undefined,
          freezeReason: data.willBeFrozen?.reason,
        })
        .$returningId();
    }
    if (!currentSub) throw new Error("Error creating subscription");

    const description =
      `Оплата подписки ${data.world.name} для @${reciever.nickname}` +
      (data.giftToUser ? ` (подарок от @${me.nickname})` : "") +
      (data.donation
        ? ` + поддержка на ${data.donation.toFixed(2)} рублей`
        : "");

    const [payment] = await tx
      .insert(paymentsTable)
      .values({
        type: "subscription",
        subscriptionId: currentSub.id,
        userId: me.id,
        provider: paymentMethod?.provider ?? "yookassa",
        savedMethodId: paymentMethod?.id,
        amount: data.price,
        description,
      })
      .$returningId();
    if (!payment) throw new Error("Error creating NightWorlds payment");

    if (paymentMethod?.provider == "admin") {
      await tx
        .update(paymentsTable)
        .set({
          externalId: payment.id,
        })
        .where(eq(paymentsTable.id, payment.id));
    } else {
      const { email } = input;
      const providerPayment = await yookassa.createPayment(
        {
          amount: {
            value: data.price.toFixed(2),
            currency: "RUB",
          },
          description,
          receipt: {
            customer: {
              email,
            },
            items: [
              {
                description: `Оплата ${
                  data.giftToUser
                    ? `подарочной подписки для @${reciever.nickname}`
                    : "подписки"
                } на ${data.world.name} на ${
                  data.prolongation.period == "monthly" ? "30 дней" : "7 дней"
                }`,
                amount: {
                  value: (data.price - (data.donation ?? 0)).toFixed(2),
                  currency: "RUB",
                },
                quantity: "1",
                vat_code: 1,
              } satisfies IItemWithoutData,
              data.donation
                ? ({
                    description: `Финансовая поддержка проекта NightWorlds`,
                    amount: {
                      value: data.donation.toFixed(2),
                      currency: "RUB",
                    },
                    quantity: "1",
                    vat_code: 1,
                  } satisfies IItemWithoutData)
                : undefined,
            ].filter((v) => !!v) as any,
          },
          //        save_payment_method: true,
          payment_method_data: paymentMethod?.externalId
            ? undefined
            : {
                type: "bank_card",
              },
          payment_method_id: paymentMethod?.externalId ?? undefined,
          capture: true,
          confirmation: {
            type: "redirect",
            return_url: new URL(
              `/dashboard/billing/payment-confirmation?id=${payment.id}`,
              "https://" + env.DOMAIN_NAME,
            ).toString(),
          },
        },
        payment.id,
      );

      await tx
        .update(paymentsTable)
        .set({
          externalId: providerPayment.id,
        })
        .where(eq(paymentsTable.id, payment.id));

      const url = providerPayment.confirmation?.confirmation_url;
      if (url) return { paymentId: payment.id, url };
    }

    return {
      paymentId: payment.id,
      url: `/dashboard/billing/payment-confirmation?id=${payment.id}`,
    };
  });
  if (paymentMethod?.provider == "admin")
    await handlePaymentUpdate("admin", paymentId);

  redirect(url);
}
