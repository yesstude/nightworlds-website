import cuid2 from "@paralleldrive/cuid2";
import {
  boolean,
  datetime,
  json,
  mysqlTableCreator,
  varchar,
  text,
} from "drizzle-orm/mysql-core";
import { WorldId } from "../api/worlds";

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
  createdAt: datetime("expires_at")
    .$default(() => new Date())
    .notNull(),
  loggedAt: datetime("logged_at"),
  expiresAt: datetime("expires_at").notNull(),
});
export type Session = typeof sessionsTable.$inferSelect;

export const serversTable = table("servers", {
  id: autocuid("id").primaryKey(),
  worldId: varchar("world_id", { length: 32 }).$type<WorldId>().notNull(),
  overwriteWorldName: varchar("overwrite_name", { length: 64 }),
  isPreOrderable: boolean("preorderable").default(false).notNull(),
  startedAt: datetime("started_at")
    .$default(() => new Date())
    .notNull(),
  closedAt: datetime("closed_at"),
});
export type BaseServer = typeof serversTable.$inferSelect;

export const playersTable = table("players", {
  id: autocuid("id").primaryKey(),
  userId: cuid("user_id")
    .references(() => usersTable.id)
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
    .references(() => usersTable.id)
    .notNull(),
  type: varchar("type", { length: 16 }).$type<"world">().notNull(),
  worldId: varchar("world_id", { length: 32 }).$type<WorldId>(),
  createdAt: datetime("created_at")
    .$default(() => new Date())
    .notNull(),
  startedAt: datetime("started_at"),
  shouldEndAt: datetime("should_end_at"),
  endedAt: datetime("ended_at"),
  frozenAt: datetime("frozen_at"),
  freezeReason: varchar("freeze_reason", { length: 16 }).$type<"preorder">(),
});
export type BaseSubscription = typeof subscriptionsTable.$inferSelect;

export const paymentsTable = table("payments", {
  id: autocuid("id").primaryKey(),
  userId: cuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  provider: varchar("provider", { length: 16 })
    .$type<"yookassa" | "admin">()
    .notNull(),
  providerId: varchar("provider_id", { length: 256 }),
  type: varchar("type", { length: 16 }).$type<"subscription">().notNull(),
  subscriptionId: cuid("subscription_id").references(
    () => subscriptionsTable.id
  ),
  description: text("description"),
  createdAt: datetime("created_at")
    .$default(() => new Date())
    .notNull(),
  closedAt: datetime("closed_at"),
  result: varchar("result", { length: 16 }).$type<"succeeded" | "canceled">(),
});
export type BasePayment = typeof paymentsTable.$inferSelect;
