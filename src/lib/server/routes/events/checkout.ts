import { procedure, router } from "$lib/server/trpc";
import { z } from "zod";
import { validateEventPermissions } from ".";
import db from "$lib/server/db";
import { orderItemTable, orderTable } from "$lib/server/db/schema";
import { TRPCError } from "@trpc/server";

export default router({
    checkout: procedure
        .input(
            z.object({
                event: z.string(),
                voucher: z.boolean(),
                order: z.array(
                    z.object({
                        id: z.number(),
                        quantity: z.number(),
                        price: z.number(),
                        total: z.number(),
                    }),
                ),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            await validateEventPermissions(input.event, ctx.user!);

            const order = await db
                .insert(orderTable)
                .values({
                    event: input.event,
                    createdBy: ctx.user!.id,
                })
                .returning({ id: orderTable.id });

            if (input.order.length === 0) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                });
            }

            try {
                await db
                    .insert(orderItemTable)
                    .values(
                        input.order.map((item) => ({
                            event: input.event,
                            order: order[0]!.id,
                            product: item.id > 0 ? item.id : null,
                            quantity: item.quantity,
                            price: item.price,
                            total: item.total,
                            voucher: input.voucher,
                        })),
                    )
                    .execute();
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                });
            }
        }),
});
