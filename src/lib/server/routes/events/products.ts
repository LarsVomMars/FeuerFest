import { procedure, router } from "$lib/server/trpc";
import { z } from "zod";
import { validateEventPermissions } from ".";
import { TRPCError } from "@trpc/server";
import db from "$lib/server/db";
import { productTable, productTypeEnum } from "$lib/server/db/schema";
import { and, asc, eq, sql, type AnyColumn } from "drizzle-orm";

const asclower = (column: AnyColumn) => asc(sql`lower(${column})`);

export default router({
    list: procedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            await validateEventPermissions(input.slug, ctx.user!);
            try {
                const products = await db
                    .select()
                    .from(productTable)
                    .where(eq(productTable.event, input.slug))
                    .orderBy(
                        asclower(productTable.name),
                        asclower(productTable.description),
                    );
                return products;
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Could not list products",
                });
            }
        }),
    create: procedure
        .input(
            z.object({
                slug: z.string(),
                name: z.string(),
                description: z.string().default(""),
                price: z.number(),
                type: z.enum(productTypeEnum.enumValues),
                backgroundColor: z.string().default("#55acee"),
                textColor: z.string().default("#ffffff"),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const role = await validateEventPermissions(input.slug, ctx.user!);
            if (role === "USER")
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Unauthorized",
                });

            try {
                await db.insert(productTable).values({
                    ...input,
                    event: input.slug,
                    createdBy: ctx.user!.id,
                });
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Could not create product",
                });
            }
        }),
    update: procedure
        .input(
            z.object({
                slug: z.string(),
                id: z.number(),
                name: z.string().optional(),
                description: z.string().optional(),
                price: z.number().optional(),
                type: z.enum(productTypeEnum.enumValues).optional(),
                backgroundColor: z.string().optional().default("#55acee"),
                textColor: z.string().optional().default("#ffffff"),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const role = await validateEventPermissions(input.slug, ctx.user!);
            if (role === "USER")
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Unauthorized",
                });

            try {
                await db
                    .update(productTable)
                    .set({
                        ...input,
                        updatedAt: new Date(),
                    })
                    .where(
                        and(
                            eq(productTable.id, input.id),
                            eq(productTable.event, input.slug),
                        ),
                    );
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Could not update product",
                });
            }
        }),
    delete: procedure
        .input(z.object({ slug: z.string(), id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const role = await validateEventPermissions(input.slug, ctx.user!);
            if (role === "USER")
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Unauthorized",
                });

            try {
                await db
                    .delete(productTable)
                    .where(
                        and(
                            eq(productTable.id, input.id),
                            eq(productTable.event, input.slug),
                        ),
                    );
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Could not delete product",
                });
            }
        }),
});
