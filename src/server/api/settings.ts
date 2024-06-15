"use server";

import { SHA256 } from "crypto-js";
import { prisma } from "../db";
import { getProfile } from "./auth";

export async function setIngamePassword(password: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: (await getProfile())!.id,
    },
  });
  if (!user) return false;

  const newuser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordHash: SHA256(password).toString(),
    },
  });

  return !!newuser;
}
