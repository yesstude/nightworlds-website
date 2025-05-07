import { and, eq, gt, isNull, or, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { env } from "~/env/server.mjs";
import { daysUntil } from "~/lib/utils";
import { getBot } from "~/server/api/bot";
import { db } from "~/server/db";
import {
  accountsTable,
  notificationsTable,
  subscriptionsTable,
  usersTable,
} from "~/server/db/schema";

export async function GET() {
  headers();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(
      and(
        or(
          isNull(subscriptionsTable.endedAt),
          gt(subscriptionsTable.endedAt, new Date()),
        ),
        and(isNull(subscriptionsTable.frozenAt)),
        isNull(subscriptionsTable.freezeReason),
        isNull(notificationsTable.id),
      ),
    )
    .innerJoin(usersTable, eq(usersTable.id, subscriptionsTable.userId))
    .innerJoin(
      accountsTable,
      and(
        eq(accountsTable.user, usersTable.id),
        eq(accountsTable.type, "telegram"),
      ),
    )
    .leftJoin(
      notificationsTable,
      and(
        eq(subscriptionsTable.id, notificationsTable.subscriptionId),
        eq(notificationsTable.type, "subscription-expires"),
        sql`${notificationsTable.sentDate} >= ${today}`,
      ),
    );

  if (subscriptions.length == 0)
    return new Response(undefined, { status: 200 });
  console.log(`Checking ${subscriptions.length} subscriptions...`);

  const bot = await getBot();

  for (let i = 0; i < subscriptions.length; i++) {
    const {
      user,
      account: telegram,
      subscriptions: subscription,
    } = subscriptions[i]!;
    if (!user || !telegram || !subscription) continue;
    if (!subscription.shouldEndAt) continue;
    const daysLeft = daysUntil(subscription.shouldEndAt);

    let message: string | undefined;
    if (daysLeft == 7)
      message = `<u>через 7 дней</u>. Мы рекомендуем продлить подписку заранее, чтобы потом не потерять доступ к услугам.`;
    if (daysLeft == 3)
      message = `<u>всего через 3 дня</u>. Мы рекомендуем продлить подписку заранее, чтобы потом не потерять доступ к услугам.`;
    if (daysLeft == 1)
      message = `<u>завтра</u>. Если вы не успеете продлить подписку, её возобновление потребует соблюдения новых условий тарифа.`;
    if (daysLeft == 0)
      message = `<u>сегодня</u>. Это означает, что вы в любой момент можете потерять доступ к услуге.`;

    if (!message) continue;

    console.log(
      `(Telegram) Notifying ${user.nickname} about their ${subscription.tag} subscription expiring in ${daysLeft} days.`,
    );

    try {
      await bot.telegram.sendMessage(
        telegram.identifier,
        `Ваша подписка <i>${subscription.tag}</i> кончается ${message}` +
          `\n\nПродлить подписку можно в дэшборде NightWorlds.`,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Продлить",
                  url: `https://${env.DOMAIN_NAME}/dashboard/worlds`,
                },
              ],
            ],
          },
        },
      );
      await db.insert(notificationsTable).values({
        userId: user.id,
        type: "subscription-expires",
        subscriptionId: subscription.id,
        sentDate: new Date(),
      });
    } catch (error) {
      console.error(
        `Unable to send notification to ${user.nickname} about their subscription expiring in ${daysLeft} days.`,
        error,
      );
    }
  }

  return new Response(undefined, { status: 200 });
}
