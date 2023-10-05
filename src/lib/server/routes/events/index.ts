import db from "$lib/db";
import { admin, user } from "$lib/server/middleware";
import { router } from "$lib/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import staff from "./staff";
import { Role } from "$lib/db/types";
import type { SessionUser } from "$lib/server/auth/session";

const generateSlug = (name: string, start: Date) =>
    `${start.getFullYear()}-${name.toLocaleLowerCase().replace(/\s/g, "-")}`;
// TODO: Generate new slug function rec

const createEventQuery = (user: SessionUser) => {
    let query = db
        .selectFrom("Event")
        .leftJoin("EventStaff", "Event.slug", "EventStaff.slug")
        .selectAll("Event")
        .distinct();
    if (user.role !== Role.OWNER) query = query.where("userId", "=", user.id);
    return query;
};

export default router({
    staff,
    listActive: user.query(async ({ ctx }) => {
        const now = new Date();
        const events = await createEventQuery(ctx.session.user)
            .where("start", "<=", now)
            .where("end", ">=", now)
            .orderBy("start", "asc")
            .execute();
        return events;
    }),
    listPast: user.query(async ({ ctx }) => {
        const now = new Date();
        const events = await createEventQuery(ctx.session.user)
            .where("end", "<", now)
            .orderBy("start", "desc")
            .execute();
        return events;
    }),
    listUpcoming: user.query(async ({ ctx }) => {
        const now = new Date();
        const events = await createEventQuery(ctx.session.user)
            .where("start", ">", now)
            .orderBy("start", "asc")
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
                .select("slug")
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
            await db
                .insertInto("EventStaff")
                .values({
                    slug,
                    userId: ctx.session.user.id,
                    role: Role.OWNER,
                })
                .execute();
            return slug;
        }),
    getBySlug: user
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            const { slug } = input;
            const event = await createEventQuery(ctx.session.user)
                .where("Event.slug", "=", slug)
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
                slug: z.string(),
                name: z.string(),
                description: z.string(),
                location: z.string(),
                start: z.date(),
                end: z.date(),
            }),
        )
        .mutation(async ({ input }) => {
            const { slug, ...data } = input;
            let newSlug = generateSlug(data.name, data.start);
            if (slug !== newSlug) {
                const events = await db
                    .selectFrom("Event")
                    .where("slug", "=", newSlug)
                    .select("slug")
                    .execute();
                if (events.length > 0) newSlug += `-${events.length + 1}`;
            }
            await db
                .updateTable("Event")
                .set({ ...data, slug: newSlug, updatedAt: new Date() })
                .where("slug", "=", slug)
                .execute();
            return newSlug;
        }),
});
