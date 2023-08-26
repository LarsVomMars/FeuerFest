import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface User {
  id: Generated<number>;
  email: string;
  name: string;
  username: Generated<string | null>;
  password: Generated<string | null>;
  role: Generated<"ADMIN" | "OWNER" | "USER">;
  status: Generated<"ACTIVE" | "INACTIVE" | "PENDING">;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date | null>;
}

export interface DB {
  User: User;
}
