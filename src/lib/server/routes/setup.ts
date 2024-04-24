import db from "../db";
import { userTable } from "../db/schema";
import { procedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createActivationToken } from "$lib/util/token";
import { sendActivationMail } from "$lib/util/mail";

const isSetup = async () =>
    (await db.select().from(userTable).limit(1)).length > 0;
const validateSetup = async () => {
    if (await isSetup())
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "Already setup",
        });
};

export default router({
    isSetup: procedure.query(async () => {
        await validateSetup();
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
            await validateSetup();

            try {
                const result = await db
                    .insert(userTable)
                    .values({ ...input, role: "OWNER" })
                    .returning({ id: userTable.id, email: userTable.email });

                if (result.length !== 1)
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Could not create user",
                    });

                const ret = result[0]!;
                const token = await createActivationToken(ret.id, ret.email);
                const url = new URL(
                    `/auth/activate/${token}`,
                    ctx.event.url.origin,
                );

                await sendActivationMail(ret.email, url.toString());
            } catch (e) {
                console.error(e);
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }
        }),
});
