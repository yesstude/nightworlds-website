import cuid2 from "@paralleldrive/cuid2";
import {
  boolean,
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
export type User = typeof usersTable.$inferSelect;

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
  loggedAt: datetime("logged_at"),
  expiresAt: datetime("expires_at").notNull(),
});
export type Session = typeof sessionsTable.$inferSelect;
