import db from "$lib/server/db";
import { eventStaffTable, eventTable } from "$lib/server/db/schema";
import { procedure, router } from "$lib/server/trpc";
import { z } from "zod";
import { eq, and, sql, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import type { User } from "lucia";

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
                    eq(eventStaffTable.eventId, event.id),
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

export const generateSlug = (name: string, start: Date) =>
    `${start.getFullYear()}-${name.toLowerCase().replace(/\s+/g, "_")}`;

export default router({
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

            const { name, description, location, start, end } = input;
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

                const result = await db
                    .insert(eventTable)
                    .values({
                        name,
                        description,
                        location,
                        start,
                        end,
                        slug,
                        createdBy: ctx.user!.id,
                    })
                    .returning({ id: eventTable.id });

                if (result.length !== 1)
                    throw new Error("Could not create event");
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Could not create event",
                });
            }
        }),
});
