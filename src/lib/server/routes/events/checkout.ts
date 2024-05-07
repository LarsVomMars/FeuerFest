import { procedure, router } from "$lib/server/trpc";
import { z } from "zod";
import { validateEventPermissions } from ".";

export default router({
    checkout: procedure
        .input(
            z.object({
                slug: z.string(),
                voucher: z.boolean(),
                order: z.array(z.object({
                    id: z.number(),
                    quantity: z.number(),
                    total: z.number(),
                })),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await validateEventPermissions(input.slug, ctx.user!);
        }),
});
