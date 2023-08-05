import { procedure, router } from "../trpc";
import { z } from "zod";
import db, { Role } from "$lib/db/";
import { TRPCError } from "@trpc/server";
import { sendMailWithHTML } from "$lib/util/mail";
import { createActivationToken } from "$lib/util/tokens";

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
                    name: input.name,
                    email: input.email,
                    role: Role.OWNER,
                })
                .execute();

            if (result.length !== 1)
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            const userId = Number(result[0]?.insertId);
            if (!userId) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

            const token = await createActivationToken(userId);
            const url = new URL(`/auth/activate/${token}`, ctx.host);

            await sendMailWithHTML(
                input.email,
                "Willkommen bei FeuerFest",
                `<h1>Hallo ${input.name},</h1><p>Willkommen bei FeuerFest!<br/>Bitte bestätige deine Email:<br/> <a href="${url}"><button>Bestätigen</button></a></p>`,
            );
        }),
});
