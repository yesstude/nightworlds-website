import { WorldId } from "../api/worlds";
import cuid2 from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import {
  boolean,
  datetime,
  json,
  mysqlTableCreator,
  varchar,
  text,
  double,
} from "drizzle-orm/mysql-core";

const table = mysqlTableCreator((name) => `nw_${name}`);
export const cuid = (name: string) => varchar(name, { length: 25 });
export const autocuid = (name: string) =>
  cuid(name).$default(() => cuid2.createId());

export const usersTable = table("user", {
  id: autocuid("id").notNull().primaryKey(),
  isSetUp: boolean("is_set_up").default(false).notNull(),
  licenseType: varchar("license_type", { length: 16 }).$type<
    "online" | "partial" | "offline"
  >(),
  nickname: varchar("nickname", { length: 32 }).unique(),
  passwordHash: varchar("password_hash", { length: 64 }),
  isAdmin: boolean("is_admin").default(false).notNull(),
  registeredAt: datetime("registered_at")
    .$default(() => new Date())
    .notNull(),
});
export type BaseUser = typeof usersTable.$inferSelect;

export const accountsTable = table("account", {
  id: autocuid("id").notNull().primaryKey(),
  user: cuid("user").references(() => usersTable.id, { onDelete: "set null" }),
  type: varchar("type", { length: 16 }).$type<"telegram">().notNull(),
  identifier: varchar("identifier", { length: 128 }).unique().notNull(),
  secondaryData: json("secondary"),
});
export type OauthAccount = typeof accountsTable.$inferSelect;

export const sessionsTable = table("session", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: cuid("user").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  type: varchar("type", { length: 16 }).$type<"web" | "game">().notNull(),
  ipAddress: varchar("ip_address", { length: 16 }),
  ipData: json("ip_data"),
  regionName: varchar("region-name", { length: 128 }),
  useragent: varchar("useragent", { length: 256 }),
  platform: varchar("platform", { length: 32 }),
  browser: varchar("browser", { length: 64 }),
  createdAt: datetime("created_at")
    .default(sql`now()`)
    .notNull(),
  loggedAt: datetime("logged_at"),
  expiresAt: datetime("expires_at").notNull(),
});
export type Session = typeof sessionsTable.$inferSelect;

export const serversTable = table("servers", {
  id: autocuid("id").primaryKey(),
  worldId: varchar("world_id", { length: 32 })
    .$type<WorldId | "proxy">()
    .notNull(),
  overwriteWorldName: varchar("overwrite_name", { length: 64 }),
  mayBeDown: boolean("may_be_down").default(false).notNull(),
  remoteMethod: varchar("remote_method", {
    length: 32,
  }).$type<"manual_pterodactyl">(),
  remoteData: json("remote_data"),
  isPreOrderable: boolean("preorderable").default(false).notNull(),
  apiKeyHash: varchar("api_key_hash", { length: 64 }),
  startedAt: datetime("started_at")
    .$default(() => new Date())
    .notNull(),
  closedAt: datetime("closed_at"),
});
export type BaseServer = typeof serversTable.$inferSelect;

export const playersTable = table("players", {
  id: autocuid("id").primaryKey(),
  userId: cuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  lastKnownNickname: varchar("last_nickname", { length: 32 }).unique(),
  createdAt: datetime("created_at")
    .$default(() => new Date())
    .notNull(),
});
export type BasePlayer = typeof playersTable.$inferSelect;

export const subscriptionsTable = table("subscriptions", {
  id: autocuid("id").primaryKey(),
  userId: cuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  autoprolongWith: cuid("autoprolong_with").references(
    () => paymentMethodsTable.id,
    { onDelete: "set null" },
  ),
  tag: varchar("tag", { length: 64 }).notNull(),
  createdAt: datetime("created_at")
    .$default(() => new Date())
    .notNull(),
  startedAt: datetime("started_at"),
  shouldEndAt: datetime("should_end_at"),
  endedAt: datetime("ended_at"),
  frozenAt: datetime("frozen_at"),
  freezeReason: varchar("freeze_reason", { length: 16 }).$type<
    "preorder" | "requested" | "unknown"
  >(),
});
export type BaseSubscription = typeof subscriptionsTable.$inferSelect;

export type PaymentProvider = "yookassa" | "admin";

export const paymentsTable = table("payments", {
  id: autocuid("id").primaryKey(),
  externalId: varchar("external_id", { length: 256 }),
  userId: cuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  provider: varchar("provider", { length: 16 })
    .$type<PaymentProvider>()
    .notNull(),
  amount: double("amount").$type<number>().notNull(),
  savedMethodId: cuid("saved_method_id").references(
    () => paymentMethodsTable.id,
    { onDelete: "set null" },
  ),
  type: varchar("type", { length: 16 }).$type<"subscription">().notNull(),
  subscriptionId: cuid("subscription_id").references(
    () => subscriptionsTable.id,
    { onDelete: "cascade" },
  ),
  description: text("description"),
  createdAt: datetime("created_at")
    .$default(() => new Date())
    .notNull(),
  closedAt: datetime("closed_at"),
  result: varchar("result", { length: 16 }).$type<"succeeded" | "canceled">(),
});
export type BasePayment = typeof paymentsTable.$inferSelect;

export const paymentMethodsTable = table("paymethods", {
  id: autocuid("id").primaryKey(),
  externalId: varchar("provider_id", { length: 256 }),
  userId: cuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  provider: varchar("provider", { length: 16 })
    .$type<PaymentProvider>()
    .notNull(),
  card: json("card").$type<{
    first6: string;
    last4: string;
    expiry_year: string;
    expiry_month: string;
  }>(),
  createdAt: datetime("created_at")
    .$default(() => new Date())
    .notNull(),
});

export const notificationsTable = table("notifications", {
  id: autocuid("id").primaryKey(),
  userId: cuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type", { length: 32 })
    .$type<"subscription-expires" | "payment-received">()
    .notNull(),
  subscriptionId: cuid("subscription_id").references(
    () => subscriptionsTable.id,
    { onDelete: "cascade" },
  ),
  paymentId: cuid("payment_id").references(() => paymentsTable.id, {
    onDelete: "cascade",
  }),
  sentDate: datetime("sent_date"),
});
