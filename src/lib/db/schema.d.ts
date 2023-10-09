import type { ColumnType } from "kysely";

export type Decimal = ColumnType<string, string | number, string | number>;

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Event {
  slug: string;
  name: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date | null>;
  createdById: number;
}

export interface EventStaff {
  id: Generated<number>;
  role: Generated<unknown>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date | null>;
  userId: number;
  slug: string;
}

export interface Product {
  id: Generated<number>;
  name: string;
  description: string;
  price: Decimal;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date | null>;
  slug: string;
}

export interface User {
  id: Generated<number>;
  email: string;
  name: string;
  username: string;
  password: Generated<string>;
  role: Generated<unknown>;
  status: Generated<unknown>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date | null>;
  dummy: Generated<number>;
}

export interface UserSession {
  id: Generated<number>;
  token: string;
  createdAt: Generated<Date>;
  expiresAt: Date;
  userId: number;
}

export interface DB {
  Event: Event;
  EventStaff: EventStaff;
  Product: Product;
  User: User;
  UserSession: UserSession;
}
