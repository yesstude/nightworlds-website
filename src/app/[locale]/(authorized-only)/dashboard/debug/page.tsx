import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { getMeUnsafe } from "~/server/api/sessions";
import { db } from "~/server/db";
import {
  notificationsTable,
  paymentMethodsTable,
  paymentsTable,
  subscriptionsTable,
  usersTable,
} from "~/server/db/schema";

export const metadata: Metadata = {
  title: "Отладка",
};

export default async function DashboardDebugPage() {
  return (
    <div className="flex w-full flex-col gap-6 lg:p-8">
      <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
        Отладка
      </h1>
      <div>
        <h2 className="mb-3 text-[24px] font-bold leading-tight tracking-normal text-foreground">
          Быстрые кнопки
        </h2>
        <div className="flex flex-wrap gap-4">
          <FastButton
            action={async () => {
              "use server";

              const me = await getMeUnsafe();

              await db
                .update(usersTable)
                .set({
                  isSetUp: false,
                  nickname: null,
                  licenseType: null,
                  passwordHash: null,
                })
                .where(eq(usersTable.id, me!.id));

              return redirect("/dashboard");
            }}
          >
            Сброс учётки
          </FastButton>
          <FastButton
            action={async () => {
              "use server";

              const me = await getMeUnsafe();

              await db
                .delete(paymentsTable)
                .where(eq(paymentsTable.userId, me!.id));
              await db
                .delete(subscriptionsTable)
                .where(eq(subscriptionsTable.userId, me!.id));
              await db
                .delete(paymentMethodsTable)
                .where(eq(paymentMethodsTable.userId, me!.id));

              return redirect("/dashboard/debug");
            }}
          >
            Сброс платёжных данных
          </FastButton>
          <FastButton
            action={async () => {
              "use server";

              const me = await getMeUnsafe();

              await db
                .update(usersTable)
                .set({
                  isAdmin: !me!.isAdmin,
                })
                .where(eq(usersTable.id, me!.id));

              return redirect("/dashboard/debug");
            }}
          >
            Вкл/выкл админку
          </FastButton>
          <FastButton
            action={async () => {
              "use server";

              const me = await getMeUnsafe();

              await db.insert(paymentMethodsTable).values({
                userId: me!.id,
                provider: "admin",
              });

              return redirect("/dashboard/billing");
            }}
          >
            Выдать золотую карту
          </FastButton>
          <FastButton
            action={async () => {
              "use server";

              const me = await getMeUnsafe();

              await db
                .delete(notificationsTable)
                .where(eq(notificationsTable.userId, me!.id));

              return redirect("/dashboard/debug");
            }}
          >
            Очистить уведомления
          </FastButton>
        </div>
      </div>
      <Players />
    </div>
  );
}

async function Players() {
  const players = await db.select().from(usersTable);

  return (
    <div>
      <h2 className="mb-3 text-[24px] font-bold leading-tight tracking-normal text-foreground">
        Игроки
      </h2>
      <div className="flex flex-wrap gap-4">
        {players.map((p) => (
          <div>
            <img
              src={`https://minotar.net/helm/${
                p.nickname ?? "MHF_Steve"
              }/48.png`}
              alt={`${p.nickname}'s avatar`}
            />
            <span>
              #{p.id}, @{p.nickname}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FastButton({
  action,
  children,
}: {
  action?: string | ((formData: FormData) => void | Promise<void>);
  children: ReactNode;
}) {
  return (
    <form action={action}>
      <Button type="submit">{children}</Button>
    </form>
  );
}
