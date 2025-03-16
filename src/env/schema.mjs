// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  DOMAIN_NAME: z.string(),
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DISCORD_ID: z.string(),
  DISCORD_SECRET: z.string(),
  TELEGRAM_BOT_TOKEN: z.string(),
  TOKEN_ENCRYPTION_KEY: z.string(),
  YOOKASSA_SHOP_ID: z.string(),
  YOOKASSA_SECRET_KEY: z.string(),
  YANDEX_CLOUD_ID: z.string(),
  YANDEX_CLOUD_SECRET: z.string(),
  YANDEX_CLOUD_BUCKET: z.string(),
  FIREBASE_JSON_CERT: z
    .string()
    .optional()
    .transform((val) => (val ? JSON.parse(val) : undefined)),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js
 * middleware, so you have to do it manually here.
 * @type {{ [k in keyof z.input<typeof serverSchema>]: string | undefined }}
 */
export const serverEnv = {
  DOMAIN_NAME: process.env.DOMAIN_NAME || process.env.VERCEL_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  DISCORD_ID: process.env.DISCORD_ID,
  DISCORD_SECRET: process.env.DISCORD_SECRET,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TOKEN_ENCRYPTION_KEY: process.env.TOKEN_ENCRYPTION_KEY,
  YOOKASSA_SHOP_ID: process.env.YOOKASSA_SHOP_ID,
  YOOKASSA_SECRET_KEY: process.env.YOOKASSA_SECRET_KEY,
  YANDEX_CLOUD_ID: process.env.YANDEX_CLOUD_ID,
  YANDEX_CLOUD_SECRET: process.env.YANDEX_CLOUD_SECRET,
  YANDEX_CLOUD_BUCKET: process.env.YANDEX_CLOUD_BUCKET,
  FIREBASE_JSON_CERT: process.env.FIREBASE_JSON_CERT,
};

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  // NEXT_PUBLIC_CLIENTVAR: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.input<typeof clientSchema>]: string | undefined }}
 */
export const clientEnv = {
  // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
};
