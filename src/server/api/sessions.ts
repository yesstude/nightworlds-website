import { db } from "../db";
import {
  type BaseUser,
  type Session,
  sessionsTable,
  usersTable,
} from "../db/schema";
import User from "../models/User";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import BrowserDetector from "browser-dtector";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
type IPData = {
  query: string;
  status: "success" | "fail";
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
};

async function getIpData(ipAddress: string) {
  const res = await fetch(`http://ip-api.com/json/${ipAddress}`);
  if (res.status >= 300) return undefined;
  const result = (await res.json()) as Partial<IPData>;
  if (result?.status != "success") return undefined;
  return result;
}

export async function generateSessionToken(): Promise<string> {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSessionIfNone(
  ...params: Parameters<typeof createSession>
) {
  const r = await validateSessionToken(params[0]);
  if (r.session) return;
  createSession(...params);
}

export async function createSession(
  token: string,
  type: Session["type"],
  userId?: string,
  ipAddress?: string,
  useragent?: string,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const dtector = new BrowserDetector();
  const browserData = useragent ? dtector.parseUserAgent(useragent) : undefined;
  let browser = browserData?.name ?? null;
  if (browserData?.version) browser += " " + browserData.version;
  if (
    useragent &&
    !browser &&
    useragent?.match(
      /^Minecraft.*$/gm,
      // /^Minecraft (((\d{1,2}\.?){2,3}-?){1,2}|Unknown Version)$/gm
    )
  )
    browser = useragent;

  const ipData = ipAddress ? await getIpData(ipAddress) : null;

  const session: typeof sessionsTable.$inferInsert = {
    id: sessionId,
    userId: userId ?? null,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    type,
    useragent: useragent ?? null,
    loggedAt: userId ? new Date() : null,
    browser,
    platform: browserData?.platform ?? null,
    ipAddress: ipAddress ?? null,
    ipData,
    regionName: ipData ? `${ipData.country}, ${ipData.city}` : null,
  };
  await db.insert(sessionsTable).values(session);
  return { ...session, createdAt: new Date() } as Session;
}

export type SessionValidationResult =
  | { session: Session; user: BaseUser | null }
  | { session: null; user: null };

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const [result] = await db
    .select({ user: usersTable, session: sessionsTable })
    .from(sessionsTable)
    .leftJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
    .where(eq(sessionsTable.id, sessionId));
  if (!result) {
    return { session: null, user: null };
  }
  const { user, session } = result;
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, session.id));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessionsTable)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessionsTable.id, session.id));
  }
  return { session, user };
}

export const getCurrentSession = async (): Promise<SessionValidationResult> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value ?? null;
  if (token === null) {
    return { session: null, user: null };
  }
  const result = await validateSessionToken(token);
  return result;
};

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
}

export async function authorizeSession(sessionId: string, userId: string) {
  await db
    .update(sessionsTable)
    .set({ userId, loggedAt: new Date() })
    .where(eq(sessionsTable.id, sessionId));
}

export async function getSessionUnsafe() {
  return (await getCurrentSession()).session;
}

export async function getMeUnsafe() {
  const me = (await getCurrentSession()).user;
  if (!me) return undefined;
  return User.getById(me.id);
}

export async function getMySessions() {
  const me = await getMeUnsafe();
  const sessions = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.userId, me!.id));
  return sessions;
}
