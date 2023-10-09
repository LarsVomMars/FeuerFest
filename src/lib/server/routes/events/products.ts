import db from "$lib/db";
import { admin } from "$lib/server/middleware";
import { router } from "$lib/server/trpc";
import { z } from "zod";

export default router({
    list: admin
        .input(z.object({ event: z.string() }))
        .query(async ({ input }) => {
            const products = await db
                .selectFrom("Product")
                .where("slug", "=", input.event)
                .selectAll()
                .execute();
            return products;
        }),
    create: admin
        .input(
            z.object({
                event: z.string(),
                name: z.string(),
                description: z.string(),
                price: z.number(),
            }),
        )
        .query(async ({ input }) => {
            await db
                .insertInto("Product")
                .values({
                    slug: input.event,
                    name: input.name,
                    description: input.description,
                    price: input.price,
                })
                .execute();
        }),
    update: admin
        .input(
            z.object({
                event: z.string(),
                id: z.number(),
                name: z.string().optional(),
                description: z.string().optional(),
                price: z.number().optional(),
            }),
        )
        .query(async ({ input }) => {
            const { event, id, ...data } = input;
            await db
                .updateTable("Product")
                .set(data)
                .where("id", "=", id)
                .where("slug", "=", event)
                .execute();
        }),
    delete: admin
        .input(z.object({ event: z.string(), id: z.number() }))
        .query(async ({ input }) => {
            await db
                .deleteFrom("Product")
                .where("id", "=", input.id)
                .where("slug", "=", input.event)
                .execute();
        }),
});
