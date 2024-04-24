import {
    pgTable,
    serial,
    text,
    boolean,
    timestamp,
    integer,
    pgEnum,
    unique,
    primaryKey,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN", "OWNER"]);
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

    dummy: boolean("dummy").default(false).notNull(),
    role: roleEnum("role").default("USER").notNull(),
    status: userStatusEnum("status").default("PENDING").notNull(),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt"),
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

export const eventTable = pgTable("Event", {
    id: serial("id").primaryKey().notNull(),
    slug: text("slug").notNull().unique(),

    name: text("name").notNull(),
    description: text("description").notNull(),

    location: text("location").notNull(),
    start: timestamp("start").notNull(),
    end: timestamp("end").notNull(),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt"),
    createdBy: integer("createdBy")
        .notNull()
        .references(() => userTable.id),
});

export const eventStaffTable = pgTable(
    "EventStaff",
    {
        eventId: integer("event_id")
            .notNull()
            .references(() => eventTable.id),
        userId: integer("user_id")
            .notNull()
            .references(() => userTable.id),
        role: roleEnum("role").default("USER").notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.eventId, table.userId] }),
    }),
);
