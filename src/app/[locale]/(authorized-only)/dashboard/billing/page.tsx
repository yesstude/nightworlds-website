import { Metadata } from "next";
import { getPaymentMethods, unlinkPaymentMethod } from "./actions";
import TransactionsBlock from "./transactions";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Icon } from "~/components/ui/icon";
import { Button } from "~/components/ui/button";
import { revalidatePath, revalidateTag } from "next/cache";

export const metadata: Metadata = {
  title: "Платежи",
};

export default async function DashboardDebugPage() {
  const methods = await getPaymentMethods();

  return (
    <div className="flex w-full flex-col gap-6 pt-8 lg:p-8">
      {methods.length > 0 && (
        <div>
          <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
            Привязанные карты
          </h1>
          <div className="flex flex-wrap gap-2">
            {methods.map((m) => (
              <Card
                key={m.id}
                variant="filled"
                className="w-[220px] [&_button]:opacity-0 [&_button]:hover:opacity-100"
              >
                <CardHeader className="flex flex-row place-items-center justify-between pt-2">
                  <Icon className="mt-2" icon="credit_card" />
                  <form
                    action={async (fd: FormData) => {
                      "use server";

                      const id = fd.get("id") as string;

                      await unlinkPaymentMethod(id);
                      revalidatePath("/dashboard/billing");
                    }}
                  >
                    <input type="hidden" name="id" value={m.id} />
                    <Button
                      variant="text"
                      size="icon"
                      className="duration-400 transition-opacity"
                      type="submit"
                    >
                      <Icon className="text-foreground" icon="delete" />
                    </Button>
                  </form>
                </CardHeader>
                <CardContent>
                  <div className="flex place-items-center gap-2">
                    <Icon icon="asterisk" />
                    <span className="mt-1 font-mono text-[26px] font-bold">
                      {m.card?.last4}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      <div>
        <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
          Подписки
        </h1>
        <div>
          <p>У вас нет активных подписок.</p>
        </div>
      </div>
      <TransactionsBlock />
    </div>
  );
}
