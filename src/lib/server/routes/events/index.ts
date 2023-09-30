import db from "$lib/db";
import { admin, user } from "$lib/server/middleware";
import { router } from "$lib/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const generateSlug = (name: string, start: Date) =>
    `${start.getFullYear()}-${name.toLocaleLowerCase().replace(/\s/g, "-")}`;

export default router({
    listActive: user.query(async () => {
        const now = new Date();
        const events = await db
            .selectFrom("Event")
            .where("start", "<=", now)
            .where("end", ">=", now)
            .orderBy("start", "asc")
            .selectAll()
            .execute();
        return events;
    }),
    listPast: user.query(async () => {
        const now = new Date();
        const events = await db
            .selectFrom("Event")
            .where("end", "<", now)
            .orderBy("start", "desc")
            .selectAll()
            .execute();
        return events;
    }),
    listUpcoming: user.query(async () => {
        const now = new Date();
        const events = await db
            .selectFrom("Event")
            .where("start", ">", now)
            .orderBy("start", "asc")
            .selectAll()
            .execute();
        return events;
    }),
    create: admin
        .input(
            z.object({
                name: z.string(),
                description: z.string(),
                location: z.string(),
                start: z.date(),
                end: z.date(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { name, description, location, start, end } = input;
            let slug = generateSlug(name, start);
            const events = await db
                .selectFrom("Event")
                .where("slug", "=", slug)
                .select("id")
                .execute();

            if (events.length > 0) slug += `-${events.length + 1}`;

            await db
                .insertInto("Event")
                .values({
                    name,
                    slug,
                    description,
                    location,
                    start,
                    end,
                    createdById: ctx.session.user.id,
                })
                .execute();
            return slug;
        }),
    getBySlug: user
        .input(z.object({ slug: z.string() }))
        .query(async ({ input }) => {
            const { slug } = input;
            const event = await db
                .selectFrom("Event")
                .where("slug", "=", slug)
                .selectAll()
                .executeTakeFirst();
            if (!event)
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Event not found.",
                });
            return event;
        }),
    update: admin
        .input(
            z.object({
                id: z.number(),
                name: z.string(),
                description: z.string(),
                location: z.string(),
                start: z.date(),
                end: z.date(),
            }),
        )
        .mutation(async ({ input }) => {
            const { id, ...data } = input;
            const slug = generateSlug(data.name, data.start);
            await db
                .updateTable("Event")
                .set({ ...data, slug, updatedAt: new Date() })
                .where("id", "=", id)
                .execute();
        }),
});
