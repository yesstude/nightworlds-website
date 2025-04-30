import { db } from "../db";
import { PaymentProvider, paymentMethodsTable } from "../db/schema";
import User from "./User";
import { DbTableBased, HasClientVersion } from "./models";
import { SQL, inArray } from "drizzle-orm";

type BasePaymentMethod = (typeof paymentMethodsTable)["$inferSelect"];

export type ClientPaymentMethod = {
  id: string;
  provider: PaymentProvider;
  card?: Exclude<BasePaymentMethod["card"], null>;
};

export default class PaymentMethod
  implements
    HasClientVersion<ClientPaymentMethod>,
    DbTableBased<typeof paymentMethodsTable>
{
  async getUser() {
    const u = await User.getById(this.id);
    return u!;
  }

  getClient() {
    return {
      id: this.id,
      provider: this.provider,
      card: this.card,
    };
  }

  static async getByIds(ids: string[]) {
    return this.selectWhere(inArray(paymentMethodsTable.id, ids));
  }
  static async getById(id: string) {
    return this.getByIds([id]);
  }

  static async selectWhere(where?: SQL<unknown>) {
    const baseMethods = await db
      .select()
      .from(paymentMethodsTable)
      .where(where);
    return baseMethods.map(
      (baseMethod) =>
        new PaymentMethod(
          baseMethod.id,
          baseMethod.provider,
          baseMethod.card ?? undefined,
        ),
    );
  }
  private constructor(
    public readonly id: string,
    public readonly provider: PaymentProvider,
    public readonly card:
      | {
          first6: string;
          last4: string;
          expiry_year: string;
          expiry_month: string;
        }
      | undefined,
  ) {}
}
