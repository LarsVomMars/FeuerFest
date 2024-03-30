import {
    pgTable,
    serial,
    text,
    boolean,
    timestamp,
    integer,
    bigint,
    bigserial,
} from "drizzle-orm/pg-core";

export const user = pgTable("User", {
    id: serial("id").primaryKey().notNull(),
    email: text("email").notNull().unique(),
    name: text("name").notNull().unique(),
    username: text("username").notNull().unique(),
    password: text("password").default("").notNull(),
    dummy: boolean("dummy").default(true).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }),
});

export const session = pgTable("Session", {
    id: text("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => user.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});
