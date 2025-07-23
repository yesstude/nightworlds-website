import "server-only";
import { checkHasVotedToday } from "./top-minecrafter-checker";
import { db } from "~/server/db";
import { hotmcVotesTable } from "~/server/db/schema";
import { and, eq, gte } from "drizzle-orm";

export type ExternalPlayerTaskResult = "DONE" | "NOT_DONE" | "ERROR";

export type ExternalPlayerTask = {
  name: string;
  checkFn: (nickname: string) => Promise<ExternalPlayerTaskResult>;
};

function checker(fn: (nickname: string) => Promise<ExternalPlayerTaskResult>) {
  return async (nickname: string) => {
    try {
      const result = await fn(nickname);
      return result;
    } catch (error) {
      console.error(error);
      return "ERROR";
    }
  };
}

export const externalPlayerTasks: { [key: string]: ExternalPlayerTask } = {
  topMinecrafterVote: {
    name: "topMinecrafterVote",
    checkFn: checker(async (nickname) => {
      const hasVotedToday = await checkHasVotedToday(nickname);
      return hasVotedToday ? "DONE" : "NOT_DONE";
    }),
  },
  hotmcVote: {
    name: "hotmcVote",
    checkFn: checker(async (nickname) => {
      const votes = await db.select().from(hotmcVotesTable).where(
        and(
          eq(hotmcVotesTable.nickname, nickname),
          gte(hotmcVotesTable.createdAt, new Date(Date.now() - 1000 * 60 * 60 * 24))
        )
      ).limit(1);
      return votes.length > 0 ? "DONE" : "NOT_DONE";
    }),
  },
};