import db from "$lib/db";
import { Role } from "$lib/db/types";
import { admin } from "$lib/server/middleware";
import { router } from "$lib/server/trpc";
import { z } from "zod";

export default router({
    list: admin
        .input(z.object({ event: z.string() }))
        .query(async ({ input }) => {
            const staff = await db
                .selectFrom("Event")
                .leftJoin("EventStaff", "Event.id", "EventStaff.eventId")
                .innerJoin("User", "EventStaff.userId", "User.id")
                .where("slug", "=", input.event)
                .select([
                    "EventStaff.id as id",
                    "Event.id as eventId",
                    "User.id as userId",
                    "User.name as name",
                    "EventStaff.role as role",
                ])
                .execute();
            return staff;
        }),
    add: admin
        .input(
            z.object({
                eventId: z.number(),
                userId: z.number(),
                role: z.nativeEnum(Role),
            }),
        )
        .mutation(async ({ input }) => {
            const staff = await db
                .insertInto("EventStaff")
                .values(input)
                .execute();
            return staff;
        }),
});
