import { procedure, router } from "../trpc";
import { z } from "zod";
import db from "$lib/db";
import { Role } from "$lib/db/types";
import { TRPCError } from "@trpc/server";
import { sendActivationMail } from "./users";

export const isSetup = async () => {
    const users = await db.selectFrom("User").selectAll().executeTakeFirst();
    return users !== undefined;
};

export default router({
    isSetup: procedure.query(async () => {
        if (await isSetup())
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Setup already complete",
            });
    }),
    createUser: procedure
        .input(
            z.object({
                name: z.string(),
                username: z.string(),
                email: z.string().email(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            if (await isSetup())
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Setup already complete",
                });
            const result = await db
                .insertInto("User")
                .values({
                    ...input,
                    role: Role.OWNER,
                })
                .execute();

            if (result.length !== 1)
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            const userId = Number(result[0]?.insertId);
            if (!userId) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            await sendActivationMail(
                userId,
                ctx.event.url.origin,
                input.email,
                input.name,
            );
        }),
});
