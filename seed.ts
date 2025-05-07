import { db } from "~/server/db";
import { residentsTable, statesTable, usersTable } from "~/server/db/schema";

(async () => {
  const [user] = await db.select().from(usersTable);

  const [state] = await db
    .insert(statesTable)
    .values({
      creatorId: user!.id,
      localizedName: { ru: "Ричланд", en: "Richland", uk: "Рiчланд" },
      verifiedAt: new Date(Date.now() + 1000 * 60),
    })
    .$returningId();

  await db.insert(residentsTable).values({
    stateId: state!.id,
    userId: user!.id,
  });

  console.log("seeded!");
})();
