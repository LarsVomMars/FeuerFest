import db from "$lib/db";
import { ProductType } from "$lib/db/types";
import { admin } from "$lib/server/middleware";
import { router } from "$lib/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export default router({
    list: admin
        .input(z.object({ event: z.string() }))
        .query(async ({ input }) => {
            const products = await db
                .selectFrom("Product")
                .where("slug", "=", input.event)
                .orderBy("name")
                .orderBy("description")
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
                type: z.nativeEnum(ProductType),
            }),
        )
        .mutation(async ({ input }) => {
            const { event, name, description, price, type } = input;
            if (price < 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Price must be positive",
                });
            }
            if (!name) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Name and description must be provided",
                });
            }
            await db
                .insertInto("Product")
                .values({
                    slug: event,
                    name,
                    description,
                    price,
                    type,
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
                type: z.nativeEnum(ProductType).optional(),
            }),
        )
        .mutation(async ({ input }) => {
            const { event, id, ...data } = input;
            if (data.price && data.price < 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Price must be positive",
                });
            }

            if (data.name === "" || data.description === "") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Name and description must be provided",
                });
            }

            await db
                .updateTable("Product")
                .set(data)
                .where("id", "=", id)
                .where("slug", "=", event)
                .execute();
        }),
    delete: admin
        .input(z.object({ event: z.string(), id: z.number() }))
        .mutation(async ({ input }) => {
            await db
                .deleteFrom("Product")
                .where("id", "=", input.id)
                .where("slug", "=", input.event)
                .execute();
        }),
});
