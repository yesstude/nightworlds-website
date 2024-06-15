"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { Provider } from "next-auth/providers";
import { prisma } from "../db";

export async function isAuthorized() {
  const session = await getServerSession();
  return !!session;
}

export type ClientSafeProvider = {
  id: Provider["id"];
  name: Provider["name"];
  type: Provider["type"];
};
export async function getAuthProviders(): Promise<ClientSafeProvider[]> {
  return authOptions.providers.map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
  }));
}

async function getUser() {
  const session = await getServerSession();
  return await prisma.user.findFirst({
    where: {
      id: session?.user.id,
    },
    include: {
      avatarCharacter: true,
    },
  });
}
export async function getProfile() {
  const user = await getUser();
  if (!user) return undefined;
  let avatar = user.avatarCharacter?.headImage;
  if (!avatar) avatar = `https://minotar.net/helm/${user.nickname}/128.png`;
  return {
    id: user.id,
    name: user.name,
    nickname: user.nickname,
    avatar,
  };
}

export async function isSetupFinished() {
  return !!(await getUser())?.passwordHash;
}

export async function isDiscordLinked() {
  const user = await getUser();
  if (!user) return false;
  const discord = await prisma.account.findFirst({
    where: {
      userId: user.id,
      provider: "discord",
    },
  });
  return !!discord;
}
