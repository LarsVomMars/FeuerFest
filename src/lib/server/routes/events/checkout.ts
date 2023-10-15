import db from "$lib/db";
import { user } from "$lib/server/middleware";
import { router } from "$lib/server/trpc";
import { z } from "zod";

const createOrderItem = async (
    id: number,
    event: string,
    productId: number,
    quantity: number,
    total: number,
    voucher: boolean,
) => {
    if (productId !== -1) {
        const product = await db
            .selectFrom("Product")
            .where("id", "=", productId)
            .where("slug", "=", event)
            .selectAll()
            .executeTakeFirst();
        if (!product) throw new Error("Product not found");
    }
    await db
        .insertInto("OrderItem")
        .values({
            orderId: id,
            productId: productId === -1 ? null : productId,
            quantity,
            total,
            voucher: +voucher,
        })
        .execute();
};

export default router({
    order: user
        .input(
            z.object({
                event: z.string(),
                order: z.array(
                    z.object({
                        id: z.number(),
                        quantity: z.number(),
                        total: z.number(),
                    }),
                ),
                voucher: z.boolean(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const order = await db
                .insertInto("Order")
                .values({
                    slug: input.event,
                    userId: ctx.session.user.id,
                })
                .execute();
            const orderId = Number(order[0]!.insertId);
            if (!orderId) throw new Error("Order not created");
            for (const item of input.order) {
                await createOrderItem(
                    orderId,
                    input.event,
                    item.id,
                    item.quantity,
                    item.total,
                    input.voucher,
                );
            }
        }),
});
