import { InferSelectModel, SQL } from "drizzle-orm";
import { MySqlTable, MySqlTableWithColumns } from "drizzle-orm/mysql-core";

export type HasClientVersion<T extends object> = T & {
  getClient(): Promise<T> | T;
};

export type DbTableBased<M extends MySqlTable> = Partial<InferSelectModel<M>>;

export type PaginationArgument =
  | {
      limit?: number;
      offset?: number;
      order?: SQL<unknown>;
    }
  | undefined;
