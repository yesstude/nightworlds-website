import { db } from "../db";
import { serversTable } from "../db/schema";
import { WorldAccessPolicy } from "./billing";
import { and, desc, eq, gt, inArray, isNull, lt, or } from "drizzle-orm";

export async function getWorlds(ids?: WorldId[]): Promise<World[]> {
  return worlds.filter(({ id }) => ids?.includes(id) ?? true);
}
export async function getWorld(id: WorldId): Promise<World> {
  return worlds.filter(({ id: i }) => id == i)[0]!;
}
export async function getClientSafeWorld(world: WorldId | ClientSafeWorld) {
  "use server";
  const result = typeof world == "string" ? await getWorld(world) : world;
  return {
    id: result.id,
    name: result.name,
    techDesc: result.techDesc,
    description: result.description,
  } satisfies ClientSafeWorld;
}

export type WorldAvailability = "full" | "preorder" | "none";
export async function getWorldsAvailability(
  ids: WorldId[],
): Promise<[WorldAvailability, string?][]> {
  const servers = await db
    .select()
    .from(serversTable)
    .where(
      and(
        inArray(serversTable.worldId, ids),
        or(
          and(
            lt(serversTable.startedAt, new Date()),
            or(
              gt(serversTable.closedAt, new Date()),
              isNull(serversTable.closedAt),
            ),
          ),
          and(
            gt(serversTable.startedAt, new Date()),
            eq(serversTable.isPreOrderable, true),
          ),
        ),
      ),
    )
    .orderBy(desc(serversTable.startedAt));
  return ids.map((id) => {
    const server = servers.find((v) => v.worldId == id);
    if (!server) return ["none", undefined];
    if (server.startedAt.getTime() > Date.now())
      return ["preorder", server.overwriteWorldName ?? undefined];
    return ["full", server.overwriteWorldName ?? undefined];
  });
}
export async function getWorldAvailability(id: WorldId) {
  return (await getWorldsAvailability([id]))[0]!;
}

export type ClientSafeWorld = {
  id: string;
  name: string;
  techDesc: string;
  description: string;
};
export type World = ClientSafeWorld & {
  accessPolicy: WorldAccessPolicy;
};

export const worldSubsciptionTags = ["medium.basic"] as const;
export type WorldSubscriptionTag = (typeof worldSubsciptionTags)[number];
export type WorldId = (typeof worlds)[number]["id"];
export async function getAllWorldIds() {
  return worlds.map((v) => v.id);
}

const worlds = [
  {
    id: "medium",
    name: "Medium",
    techDesc: "Полуванильный, похож на: #СП, MineShield",
    description:
      "Что если совместить приватный Майнкрафт сервер с современными технологиями?",
    accessPolicy: {
      type: "subscription",
      period: "monthly",
      pricingAfter: {
        0: {
          price: 69,
        },
      },
      tag: "medium.basic",
    },
  },
  {
    id: "mcrusch",
    name: "MCRuSCh",
    techDesc: "Неванильный без модов, похож на MCChampionship, Manhunt",
    description:
      "Авторские и не только чемпионаты по выживанию от NightWorlds.",
    accessPolicy: {
      type: "server-dependent",
    },
  },
  {
    id: "finity",
    name: "Finity",
    techDesc: '"Хардкор", ранее назывался Hardcore',
    description:
      "Ограниченное количество жизней. Когда они кончатся — вы покинете игру.",
    accessPolicy: {
      type: "free",
    },
  },
  {
    id: "hardcore",
    name: "Hardcore",
    techDesc: '"Хардкор", ранее назывался UltraHardcore',
    description: "У вас всего одна жизнь. Будьте аккуратнее.",
    accessPolicy: {
      type: "free",
    },
  },
  {
    id: "creative_mode",
    name: "Creative Mode",
    techDesc: "Ванильный, в режиме творчества",
    description:
      "Общайтесь с игроками, стройте город, участвуйте в процессе RolePlay.",
    accessPolicy: {
      type: "free",
    },
  },
  {
    id: "high_roleplay",
    name: "High RolePlay",
    techDesc: "Неванильный без модов, похож на SAMP, GTA 5 RP",
    description:
      "Почувствуйте себя гражданином вымышленной страны. Вам придётся работать, покупать имущество и быть частью виртуального общества со своим законом и экономикой.",
    accessPolicy: {
      type: "free",
    },
  },
] as const satisfies World[];
