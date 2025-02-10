import { SQL, and, desc, eq, inArray, isNotNull, or } from "drizzle-orm";
import { db } from "../db";
import {
  paymentMethodsTable,
  paymentsTable,
  subscriptionsTable,
  usersTable,
} from "../db/schema";
import { DbTableBased, HasClientVersion, PaginationArgument } from "./models";
import PaymentMethod from "./PaymentMethod";
import Payment from "./Payment";

export interface ClientUser {
  id: string;
  nickname: string;
  avatarUrl: string;
}

export default class User
  implements HasClientVersion<ClientUser>, DbTableBased<typeof usersTable>
{
  async setNickname(v: string) {
    await db
      .update(usersTable)
      .set({ nickname: v })
      .where(eq(usersTable.id, this.id));
    this.nickname = v;
  }
  async setIsSetUp(v: boolean) {
    await db
      .update(usersTable)
      .set({ isSetUp: v })
      .where(eq(usersTable.id, this.id));
    this.isSetUp = v;
  }
  async setLicenseType(v: "online" | "partial" | "offline") {
    await db
      .update(usersTable)
      .set({ licenseType: v })
      .where(eq(usersTable.id, this.id));
    this.licenseType = v;
  }

  async getPaymentMethods() {
    return PaymentMethod.selectWhere(eq(paymentMethodsTable.userId, this.id));
  }

  async getPayments(pg?: PaginationArgument) {
    const ids = await db
      .select({ id: paymentsTable.id })
      .from(paymentsTable)
      .leftJoin(
        subscriptionsTable,
        eq(paymentsTable.subscriptionId, subscriptionsTable.id)
      )
      .where(
        or(
          eq(paymentsTable.userId, this.id),
          eq(subscriptionsTable.userId, this.id)
        )
      )
      .orderBy(pg?.order ?? desc(paymentsTable.createdAt))
      .limit(pg?.limit ?? 10)
      .offset(pg?.offset ?? 0);
    return Payment.getByIds(ids.map((id) => id.id));
  }

  getClient() {
    return {
      id: this.id,
      nickname: this.nickname,
      avatarUrl: this.avatarUrl,
    };
  }

  static async getByIds(ids: string[]) {
    return this.selectWhere(
      and(inArray(usersTable.id, ids), isNotNull(usersTable.nickname))
    );
  }
  static async getById(id: string) {
    return (await User.getByIds([id]))[0];
  }

  static async selectWhere(where?: SQL<unknown>) {
    const baseUsers = await db.selectDistinct().from(usersTable).where(where);
    return baseUsers.map(
      (user) =>
        new User(
          user.id,
          user.nickname!,
          undefined as any,
          user.isSetUp,
          user.licenseType ?? undefined,
          user.registeredAt
        )
    );
  }
  private constructor(
    public readonly id: string,
    public nickname: string,
    public avatarUrl: string,
    public isSetUp: boolean,
    public licenseType: "online" | "partial" | "offline" | undefined,
    public readonly registeredAt: Date
  ) {
    if (!avatarUrl) avatarUrl = User.getDefaultAvatarUrl(nickname);
  }

  static getDefaultAvatarUrl(nickname?: string) {
    return `https://minotar.net/helm/${nickname ?? "MHF_Steve"}/128.png`;
  }
}
