import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface User {
  id: Generated<number>;
  email: string;
  name: string;
  username: Generated<string>;
  password: Generated<string>;
  role: Generated<unknown>;
  status: Generated<unknown>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date | null>;
}

export interface UserSession {
  id: Generated<number>;
  token: string;
  createdAt: Generated<Date>;
  expiresAt: Date;
  userId: number;
}

export interface DB {
  User: User;
  UserSession: UserSession;
}
