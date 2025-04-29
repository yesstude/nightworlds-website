import { db } from "../db";
import { BaseServer, serversTable } from "../db/schema";
import { broadcastToAdmins } from "./bot";
import { eq } from "drizzle-orm";

export type ManualPterodactylRemoteData = {
  headers: { [key: string]: string };
  host: string;
  serverId: string;
};

export type ServerStatus =
  | "running"
  | "starting"
  | "stopped"
  | "stopping"
  | "remote-down";
export async function getServerStatus(serverId: string) {
  const [server] = await db
    .select()
    .from(serversTable)
    .where(eq(serversTable.id, serverId));

  const status = await _getServerStatus(server!);

  if (server!.remoteMethod && !server!.mayBeDown && status == "remote-down")
    await broadcastToAdmins(
      `Удаленный доступ к серверу ${server!.id} (${
        server!.worldId
      }) недоступен, хотя до этого был настроен.`,
    );
  if (server!.remoteMethod && !server!.mayBeDown && status == "stopped") {
    await powerServer(serverId, "start");
    await broadcastToAdmins(
      `Сервер ${server!.id} (${
        server!.worldId
      }) оказался выключен. NightWorlds осуществляет автоматическую попытку восстановления.`,
    );
  }
  if (server!.remoteMethod && server!.mayBeDown && status == "running")
    await broadcastToAdmins(
      `Сервер ${server!.id} (${server!.worldId}) был запущен после ошибки.`,
    );

  await db
    .update(serversTable)
    .set({ mayBeDown: !!server!.remoteMethod && status !== "running" })
    .where(eq(serversTable.id, serverId));

  return status;
}
export async function _getServerStatus(
  server: BaseServer,
): Promise<ServerStatus> {
  if (!server!.remoteMethod) return "remote-down";
  if (server!.remoteMethod == "manual_pterodactyl") {
    const data = server!.remoteData as ManualPterodactylRemoteData;
    const url = new URL(
      `/api/client/servers/${data.serverId}/resources`,
      data.host,
    );
    try {
      const res = await fetch(url, {
        headers: data.headers,
      });
      if (res.status != 200) return "remote-down";
      const output = await res.json();
      const externalStatus = output.attributes.current_state;
      if (!externalStatus) return "remote-down";
      if (externalStatus == "running") return "running";
      if (externalStatus == "starting") return "starting";
      if (externalStatus == "stopping") return "stopping";
      return "stopped";
    } catch (error) {
      console.error(error);
      return "remote-down";
    }
  }

  return "remote-down";
}

export type ServerPowerAction = "start" | "stop";
export async function powerServer(
  serverId: string,
  action: ServerPowerAction,
): Promise<boolean> {
  const [server] = await db
    .select()
    .from(serversTable)
    .where(eq(serversTable.id, serverId));

  if (!server!.remoteMethod) return false;
  if (server!.remoteMethod == "manual_pterodactyl") {
    const data = server!.remoteData as ManualPterodactylRemoteData;
    const url = new URL(
      `/api/client/servers/${data.serverId}/power`,
      data.host,
    );
    try {
      const res = await fetch(url, {
        method: "post",
        headers: { ...data.headers, "Content-Type": "application/json" },
        body: JSON.stringify({ signal: action }),
      });
      if (res.status != 204) return false;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  return false;
}
