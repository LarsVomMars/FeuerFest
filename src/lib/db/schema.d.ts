import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface User {
  id: Generated<number>;
  email: string;
  name: string;
  username: string | null;
  createdAt: Generated<Date>;
  updatedAt: Date | null;
  password: string | null;
  role: Generated<"ADMIN" | "OWNER" | "USER">;
  status: Generated<"ACTIVE" | "INACTIVE" | "PENDING">;
}

export interface DB {
  User: User;
}
