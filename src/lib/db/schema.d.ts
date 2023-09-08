import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Event {
  id: Generated<number>;
  name: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date | null>;
  createdById: number;
  slug: string;
}

export interface EventStaff {
  id: Generated<number>;
  role: Generated<"ADMIN" | "OWNER" | "USER">;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date | null>;
  eventId: number;
  userId: number;
}

export interface User {
  id: Generated<number>;
  email: string;
  name: string;
  username: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date | null>;
  role: Generated<"ADMIN" | "OWNER" | "USER">;
  status: Generated<"ACTIVE" | "INACTIVE" | "PENDING">;
  password: Generated<string>;
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
  User: User;
  UserSession: UserSession;
}
