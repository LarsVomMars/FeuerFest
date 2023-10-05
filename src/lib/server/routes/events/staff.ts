import db from "$lib/db";
import { Role, Status } from "$lib/db/types";
import { admin } from "$lib/server/middleware";
import { router } from "$lib/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export default router({
    list: admin
        .input(z.object({ event: z.string() }))
        .query(async ({ input }) => {
            const staff = await db
                .selectFrom("Event")
                .leftJoin("EventStaff", "Event.slug", "EventStaff.slug")
                .innerJoin("User", "EventStaff.userId", "User.id")
                .where("Event.slug", "=", input.event)
                .select([
                    "EventStaff.id as id",
                    "Event.slug as slug",
                    "User.id as userId",
                    "User.name as name",
                    "EventStaff.role as role",
                ])
                .orderBy("User.name")
                .execute();
            return staff;
        }),
    listAvailable: admin
        .input(z.object({ event: z.string() }))
        .query(async ({ input }) => {
            const available = await db
                .selectFrom("User")
                .where(({ not, exists, selectFrom, and, eb, or }) =>
                    and([
                        or([
                            eb("status", "=", Status.ACTIVE),
                            and([
                                eb("status", "=", Status.PENDING),
                                eb("dummy", "=", 1),
                            ]),
                        ]),
                        not(
                            exists(
                                selectFrom("EventStaff")
                                    .whereRef(
                                        "EventStaff.userId",
                                        "=",
                                        "User.id",
                                    )
                                    .where("EventStaff.slug", "=", input.event)
                                    .select("EventStaff.id"),
                            ),
                        ),
                    ]),
                )
                .select(["User.id", "User.name", "User.role"])
                .orderBy("User.name")
                .execute();
            return available;
        }),
    add: admin
        .input(
            z.object({
                slug: z.string(),
                userId: z.number(),
                role: z.nativeEnum(Role),
            }),
        )
        .mutation(async ({ input }) => {
            const exists = await db
                .selectFrom("EventStaff")
                .where("slug", "=", input.slug)
                .where("userId", "=", input.userId)
                .select("id")
                .execute();
            if (exists.length > 0)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Already exists.",
                });
            await db.insertInto("EventStaff").values(input).execute();
        }),
    update: admin
        .input(
            z.object({
                slug: z.string(),
                userId: z.number(),
                role: z.nativeEnum(Role),
            }),
        )
        .mutation(async ({ input }) => {
            await db
                .updateTable("EventStaff")
                .set({ role: input.role })
                .where("slug", "=", input.slug)
                .where("userId", "=", input.userId)
                .execute();
        }),
});
