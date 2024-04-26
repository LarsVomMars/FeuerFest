import { procedure, router } from "$lib/server/trpc";
import { z } from "zod";
import { validateEventPermissions } from ".";
import { TRPCError } from "@trpc/server";
import db from "$lib/server/db";
import { productTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export default router({
    list: procedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            await validateEventPermissions(input.slug, ctx.user!);
            try {
                const products = await db
                    .select()
                    .from(productTable)
                    .where(eq(productTable.event, input.slug));
                return products;
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Could not list products",
                });
            }
        }),
});
