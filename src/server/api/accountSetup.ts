"use server";

import { SHA256 } from "crypto-js";
import { prisma } from "../db";
import { getProfile } from "./auth";

export async function checkNickname(nickname: string) {
  let result = {
    occupied: false,
    invalid: false,
    tooShort: false,
    tooLong: false,
    readyToUse: true,
  };

  if (nickname.length < 4) result.tooShort = true;
  if (nickname.length > 15) result.tooLong = true;
  if (!nickname.match(/^[A-Za-z_\d]*$/)) result.invalid = true;
  const taken = await prisma.user.findFirst({
    where: {
      nickname,
    },
  });
  if (taken) result.occupied = true;

  if (result.occupied || result.invalid || result.tooShort || result.tooLong)
    result.readyToUse = false;

  return result;
}

export async function setNickname(nickname: string) {
  if (!(await checkNickname(nickname)).readyToUse) return false;
  await prisma.user.update({
    where: {
      id: (await getProfile())!.id,
    },
    data: {
      nickname,
    },
  });
  return true;
}

export async function setPassword(password: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: (await getProfile())!.id,
    },
  });
  if (!user || user.passwordHash) return false;

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
