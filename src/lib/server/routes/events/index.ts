import db from "$lib/server/db";
import { eventStaffTable, eventTable } from "$lib/server/db/schema";
import { procedure, router } from "$lib/server/trpc";
import { z } from "zod";
import { eq, and, sql, count, lte, gte, SQL, gt, lt } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import type { User } from "lucia";
import products from "./products";

export const validateEventPermissions = async (
    slug: string,
    user: User,
): Promise<string> => {
    try {
        const events = await db
            .select()
            .from(eventTable)
            .where(eq(eventTable.slug, slug));
        if (!events || events.length !== 1) throw new Error("Event not found");
        const event = events[0]!;

        if (user.role === "OWNER") return "ADMIN";

        const staff = await db
            .select()
            .from(eventStaffTable)
            .where(
                and(
                    eq(eventStaffTable.event, event.slug),
                    eq(eventStaffTable.userId, user.id),
                ),
            );

        if (!staff || staff.length !== 1) throw new Error("User not found");
        return staff[0]!.role;
    } catch (e) {
        console.error(e);
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Event not found",
        });
    }
};

const generateSlug = (name: string, start: Date) =>
    `${start.getFullYear()}-${name.toLowerCase().replace(/\s+/g, "_")}`;

const queryEvents = (user: User, ...where: SQL[]) => {
    return db
        .selectDistinct()
        .from(eventTable)
        .leftJoin(eventStaffTable, eq(eventStaffTable.event, eventTable.slug))
        .where(
            and(
                ...where,
                user.role !== "OWNER"
                    ? eq(eventStaffTable.userId, user.id)
                    : undefined,
            ),
        )
        .orderBy(eventTable.start);
};

export default router({
    products,
    listActive: procedure.query(async ({ ctx }) => {
        const now = new Date();
        const events = await queryEvents(
            ctx.user!,
            lte(eventTable.start, now),
            gte(eventTable.end, now),
        );
        return events;
    }),
    listUpcoming: procedure.query(async ({ ctx }) => {
        const now = new Date();
        const events = await queryEvents(ctx.user!, gt(eventTable.start, now));
        return events;
    }),
    listPast: procedure.query(async ({ ctx }) => {
        const now = new Date();
        const events = await queryEvents(ctx.user!, lt(eventTable.end, now));
        return events;
    }),
    get: procedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            const events = await queryEvents(
                ctx.user!,
                eq(eventTable.slug, input.slug),
            );
            if (events.length !== 1)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Event not found",
                });
            return events[0];
        }),
    create: procedure
        .input(
            z.object({
                name: z.string(),
                description: z.string().default(""),
                location: z.string(),
                start: z.date(),
                end: z.date(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            if (ctx.user?.role === "USER")
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Unauthorized",
                });

            const { description, location, start, end } = input;
            const name = input.name.trim();
            let slug = generateSlug(name, start);

            try {
                const events = await db
                    .select({ count: count() })
                    .from(eventTable)
                    .where(
                        and(
                            eq(eventTable.name, name),
                            sql`extract(year from start) = ${start.getFullYear()}`,
                        ),
                    );
                if (events[0] && events[0].count > 0)
                    slug += `-${events[0].count + 1}`;

                await db.insert(eventTable).values({
                    name,
                    description,
                    location,
                    start,
                    end,
                    slug,
                    createdBy: ctx.user!.id,
                });
                return slug;
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Could not create event",
                });
            }
        }),
});
