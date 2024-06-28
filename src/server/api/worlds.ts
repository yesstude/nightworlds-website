"use server";

import { prisma } from "../db";

type SubscriptionAccessType = {
  type: "subscription";
  value: number;
};
type AccessType = SubscriptionAccessType;

export type World = {
  name: string;
  displayName: string;
  description?: string;
  accessType: AccessType;
  available: boolean;
};

export async function getWorld(name: string): Promise<World | undefined> {
  const world = await prisma.world.findFirst({
    where: {
      name,
    },
  });

  if (!world) return undefined;
  return {
    name: world?.name,
    displayName: world.displayName,
    description: world?.description || undefined,
    available: world?.isAvailable,
    accessType: world?.accessType as AccessType,
  };
}

async function getWorlds(
  filter: Parameters<typeof prisma.world.findMany>[0]
): Promise<World[]> {
  const worlds = await prisma.world.findMany(filter);
  return worlds.map((world) => ({
    name: world?.name,
    displayName: world.displayName,
    description: world?.description || undefined,
    available: world?.isAvailable,
    accessType: world?.accessType as AccessType,
  }));
}

export async function getAllWorlds() {
  return getWorlds({});
}

export async function getAvailableWorlds() {
  return getWorlds({ where: { isAvailable: true } });
}
