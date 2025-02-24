"use server";

import { desc, eq } from "drizzle-orm";
import {
  ManualPterodactylRemoteData,
  getServerStatus,
} from "~/server/api/servers";
import { getMeUnsafe } from "~/server/api/sessions";
import { db } from "~/server/db";
import { accountsTable, serversTable, usersTable } from "~/server/db/schema";
import User from "~/server/models/User";

export async function getAdminMe() {
  const me = await getMeUnsafe();
  if (!me?.isAdmin) {
    throw new Error("Not authorized");
  }
  return me!;
}

export async function getUsersCount() {
  await getAdminMe();

  return await db.$count(usersTable);
}

export async function getUsers(page: number = 0, pageSize: number = 20) {
  const me = await getAdminMe();

  const users = await db
    .select()
    .from(usersTable)
    .leftJoin(accountsTable, eq(usersTable.id, accountsTable.user))
    .orderBy(desc(usersTable.registeredAt))
    .offset(page * pageSize)
    .limit(pageSize);
  return users.map((u) => ({
    ...u.user,
    passwordHash: undefined,
    avatarUrl: User.getDefaultAvatarUrl(u.user.nickname ?? undefined),
    account: `${u.account?.type ?? "none"}: ${
      (u.account?.secondaryData as any).username ??
      (u.account?.secondaryData as any).first_name ??
      "unknown"
    }`,
  }));
}

export async function getProxy() {
  const me = await getAdminMe();

  const [server] = await db
    .select()
    .from(serversTable)
    .where(eq(serversTable.worldId, "proxy"));

  if (!server) return undefined;

  const status = await getServerStatus(server.id);

  return { ...server, status };
}

export async function setProxyRemoteData(data: string) {
  const me = await getAdminMe();

  const json = data.match(/{(.|\s)*}/)?.[0];
  const url = data.match(/"(.*)"/)?.[1];
  if (!url) return false;

  if (!json) return false;
  const obj = JSON.parse(json);

  const { cookie, Referer, ...headers } = obj.headers;
  const xsrfToken = headers["x-xsrf-token"] as string | undefined;
  const refererGroups = Referer.match(
    /^(?<protocol>https?:\/\/)(?<host>[^\/]+)/
  )?.groups;
  const host = refererGroups?.protocol + refererGroups?.host;
  const serverId = url.match(/servers\/(?<serverId>[^/]+)\//)?.groups?.serverId;

  if (!cookie || !xsrfToken || !Referer || !host || !serverId) return false;

  const remoteData = {
    headers: {
      "x-xsrf-token": xsrfToken,
      cookie,
      Referer,
    },
    host,
    serverId,
  } satisfies ManualPterodactylRemoteData;

  await db
    .update(serversTable)
    .set({
      remoteMethod: "manual_pterodactyl",
      remoteData,
    })
    .where(eq(serversTable.worldId, "proxy"));

  return true;
}
