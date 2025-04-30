import { db } from "../db";
import { accountsTable, usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { Telegraf } from "telegraf";
import { env } from "~/env/server.mjs";

export const getBot = async (): Promise<Telegraf> => {
  if (!(globalThis as any).tg_bot) {
    const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

    (globalThis as any).tg_bot = bot;
  }

  return (globalThis as any).tg_bot;
};

export async function broadcastToAdmins(message: string) {
  const bot = await getBot();
  const admins = await db
    .select()
    .from(usersTable)
    .leftJoin(accountsTable, eq(accountsTable.user, usersTable.id))
    .where(eq(usersTable.isAdmin, true));

  for (const admin of admins) {
    if (!admin.account || admin.account.type != "telegram") continue;
    try {
      await bot.telegram.sendMessage(admin.account.identifier, message);
    } catch (error) {
      console.error(error);
    }
  }
}
