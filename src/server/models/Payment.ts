import { db } from "../db";
import { BasePayment, PaymentProvider, paymentsTable } from "../db/schema";
import User from "./User";
import { DbTableBased, HasClientVersion } from "./models";
import { SQL, inArray } from "drizzle-orm";

export type ClientPayment = {
  id: string;
  provider: PaymentProvider;
  type: BasePayment["type"];
  description?: string;
  closedAt?: Date;
  result?: Exclude<BasePayment["result"], null>;
};

export default class Payment
  implements HasClientVersion<ClientPayment>, DbTableBased<typeof paymentsTable>
{
  async getPayer() {
    const payer = await User.getById(this.userId);
    return payer!;
  }

  getClient() {
    return {
      id: this.id,
      provider: this.provider,
      type: this.type,
      description: this.description,
      closedAt: this.closedAt,
      result: this.result,
    };
  }

  static async getByIds(ids: string[]) {
    return this.selectWhere(inArray(paymentsTable.id, ids));
  }
  static async getById(id: string) {
    return this.getByIds([id]);
  }

  static async selectWhere(where?: SQL<unknown>) {
    const basePayments = await db.select().from(paymentsTable).where(where);
    return basePayments.map(
      (basePayment) =>
        new Payment(
          basePayment.id,
          basePayment.externalId ?? undefined,
          basePayment.userId,
          basePayment.provider,
          basePayment.savedMethodId ?? undefined,
          basePayment.type,
          basePayment.subscriptionId ?? undefined,
          basePayment.description ?? undefined,
          basePayment.createdAt,
          basePayment.closedAt ?? undefined,
          basePayment.result ?? undefined,
        ),
    );
  }
  private constructor(
    public readonly id: string,
    externalId: string | undefined,
    readonly userId: string,
    public provider: PaymentProvider,
    savedMethodId: string | undefined,
    public readonly type: "subscription",
    readonly subscriptionId: string | undefined,
    public description: string | undefined,
    createdAt: Date,
    public closedAt: Date | undefined,
    public result: Exclude<BasePayment["result"], null> | undefined,
  ) {}
}
