import {
    pgTable,
    serial,
    text,
    boolean,
    timestamp,
    integer,
    pgEnum,
    primaryKey,
    unique,
    varchar,
    decimal,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN", "OWNER"]);
export const userStatusEnum = pgEnum("userStatus", [
    "PENDING",
    "ACTIVE",
    "INACTIVE",
]);
export const productTypeEnum = pgEnum("productType", ["FOOD", "DRINK", "BAR"]);

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
    slug: text("slug").primaryKey().notNull(),

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
        event: text("event_slug")
            .notNull()
            .references(() => eventTable.slug),
        userId: integer("user_id")
            .notNull()
            .references(() => userTable.id),
        role: roleEnum("role").default("USER").notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.event, table.userId] }),
    }),
);

// export const productTypeTable = pgTable(); // TODO: make this a table instead of an enum

export const productTable = pgTable(
    "Product",
    {
        id: serial("id").primaryKey().notNull(),
        name: text("name").notNull(),
        description: text("description").notNull(),
        price: decimal("price", { precision: 10, scale: 2 })
            .$type<number>()
            .notNull(),
        type: productTypeEnum("type").notNull(),

        backgroundColor: varchar("backgroundColor", { length: 7 }),
        textColor: varchar("textColor", { length: 7 }),

        createdAt: timestamp("createdAt").defaultNow().notNull(),
        updatedAt: timestamp("updatedAt"),
        createdBy: integer("createdBy")
            .notNull()
            .references(() => userTable.id),
        event: text("event_slug")
            .notNull()
            .references(() => eventTable.slug),
    },
    (table) => ({
        unq: unique("product_name").on(table.name, table.description),
    }),
);

export const orderTable = pgTable("Order", {
    id: serial("id").primaryKey().notNull(),
    event: text("event_slug")
        .notNull()
        .references(() => eventTable.slug),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
    createdBy: integer("createdBy")
        .notNull()
        .references(() => userTable.id),
});

export const orderItemTable = pgTable("OrderItem", {
    id: serial("id").primaryKey().notNull(),
    event: text("event_slug")
        .notNull()
        .references(() => eventTable.slug),
    order: integer("order_id")
        .notNull()
        .references(() => orderTable.id),
    product: integer("product_id").references(() => productTable.id),

    quantity: integer("quantity").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }),
    total: decimal("total", { precision: 10, scale: 2 })
        .$type<number>()
        .notNull(),

    voucher: boolean("voucher").default(false).notNull(),
});
