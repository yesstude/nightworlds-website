"use server";

import { and, eq, gt, isNull, lt, or } from "drizzle-orm";
import { getMeOrThrow } from "~/server/api/sessions";
import { db } from "~/server/db";
import {
  BaseResident,
  BaseState,
  residentsTable,
  statesTable,
} from "~/server/db/schema";
export type ClientSafeState = {
  id: BaseState["id"];
  localizedName: BaseState["localizedName"];
  flag: string;
};

export type ClientSafeResident = {
  id: BaseResident["id"];
  state: ClientSafeState;
};

export async function getMyResidences() {
  const me = await getMeOrThrow();
  const baseresidences = await db
    .select()
    .from(residentsTable)
    .where(
      and(
        eq(residentsTable.userId, me.id),
        lt(residentsTable.startedAt, new Date()),
        or(
          isNull(residentsTable.endedAt),
          gt(residentsTable.endedAt, new Date())
        )
      )
    )
    .leftJoin(statesTable, eq(statesTable.id, residentsTable.stateId));

  return baseresidences.map(
    (br) =>
      ({
        id: br.residents!.id,
        state: {
          id: br.states!.id,
          localizedName: br.states!.localizedName,
          flag: br.states!.flag,
        },
      } satisfies ClientSafeResident)
  );
}
