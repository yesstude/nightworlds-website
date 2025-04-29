"use server";

import { getAdminMe } from "../actions";
import { SHA256, enc } from "crypto-js";
import { eq } from "drizzle-orm";
import {
  ManualPterodactylRemoteData,
  ServerStatus,
  getServerStatus,
  powerServer as apiPowerServer,
} from "~/server/api/servers";
import { generateSessionToken } from "~/server/api/sessions";
import { db } from "~/server/db";
import { serversTable } from "~/server/db/schema";

export async function getServers() {
  const me = await getAdminMe();

  const servers = await db.select().from(serversTable);

  const statuses: ServerStatus[] = [];

  for (const server of servers) {
    const status = await getServerStatus(server.id);
    statuses.push(status);
  }

  return servers.map((s, i) => ({
    ...s,
    status: statuses[i],
  }));
}

export async function getServer(serverId: string) {
  const me = await getAdminMe();

  const [server] = await db
    .select()
    .from(serversTable)
    .where(eq(serversTable.id, serverId));

  if (!server) return undefined;

  const status = await getServerStatus(server.id);

  return { ...server, status };
}

export async function setServerRemoteData(serverId: string, data: string) {
  const me = await getAdminMe();

  const json = data.match(/{(.|\s)*}/)?.[0];
  const url = data.match(/"(.*)"/)?.[1];
  if (!url) return false;

  if (!json) return false;
  const obj = JSON.parse(json);

  const { cookie, Referer, ...headers } = obj.headers;
  const xsrfToken = headers["x-xsrf-token"] as string | undefined;
  const refererGroups = Referer.match(
    /^(?<protocol>https?:\/\/)(?<host>[^\/]+)/,
  )?.groups;
  const host = refererGroups?.protocol + refererGroups?.host;
  const externalServerId = url.match(/servers\/(?<serverId>[^/]+)\//)?.groups
    ?.serverId;

  if (!cookie || !xsrfToken || !Referer || !host || !externalServerId)
    return false;

  const remoteData = {
    headers: {
      "x-xsrf-token": xsrfToken,
      cookie,
      Referer,
    },
    host,
    serverId: externalServerId,
  } satisfies ManualPterodactylRemoteData;

  await db
    .update(serversTable)
    .set({
      remoteMethod: "manual_pterodactyl",
      remoteData,
    })
    .where(eq(serversTable.id, serverId));

  return true;
}

export async function powerServer(...args: Parameters<typeof apiPowerServer>) {
  const me = await getAdminMe();

  return apiPowerServer(...args);
}

export async function resetApiKey(serverId: string) {
  const newkey = await generateSessionToken();

  const [server] = await db
    .select()
    .from(serversTable)
    .where(eq(serversTable.id, serverId));
  const hash = enc.Base64.stringify(SHA256(enc.Utf8.parse(newkey)));

  await db
    .update(serversTable)
    .set({
      apiKeyHash: hash,
    })
    .where(eq(serversTable.id, server!.id));

  return newkey;
}
