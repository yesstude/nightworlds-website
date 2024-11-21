import cuid2 from "@paralleldrive/cuid2";
import {
  datetime,
  json,
  mysqlTableCreator,
  varchar,
} from "drizzle-orm/mysql-core";

const table = mysqlTableCreator((name) => `nw_${name}`);
export const cuid = (name: string) => varchar(name, { length: 25 });
export const autocuid = (name: string) =>
  cuid(name).$default(() => cuid2.createId());

export const usersTable = table("user", {
  id: autocuid("id").notNull().primaryKey(),
  nickname: varchar("nickname", { length: 32 }).unique(),
  passwordHash: varchar("password_hash", { length: 64 }),
});

export const sessionsTable = table("session", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: cuid("user").references(() => usersTable.id),
  type: varchar("type", { length: 16 }).$type<"web" | "game">().notNull(),
  ipAddress: varchar("ip_address", { length: 16 }),
  ipData: json("ip_data"),
  regionName: varchar("region-name", { length: 128 }),
  useragent: varchar("useragent", { length: 128 }),
  platform: varchar("platform", { length: 32 }),
  browser: varchar("browser", { length: 64 }),
  loggedAt: datetime("logged_at"),
  expiresAt: datetime("expires_at").notNull(),
});

export type User = typeof usersTable.$inferSelect;
export type Session = typeof sessionsTable.$inferSelect;
