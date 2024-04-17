import {
    pgTable,
    serial,
    text,
    boolean,
    timestamp,
    integer,
    pgEnum,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("userRole", ["USER", "ADMIN", "OWNER"]);
export const userStatusEnum = pgEnum("userStatus", [
    "PENDING",
    "ACTIVE",
    "INACTIVE",
]);

export const userTable = pgTable("User", {
    id: serial("id").primaryKey().notNull(),
    email: text("email").notNull().unique(),
    name: text("name").notNull().unique(),
    username: text("username").unique(),
    password: text("password").default("").notNull(),

    dummy: boolean("dummy").default(true).notNull(),
    role: userRoleEnum("role").default("USER").notNull(),
    status: userStatusEnum("status").default("PENDING").notNull(),

    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }),
});

export const sessionTable = pgTable("Session", {
    id: text("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});
