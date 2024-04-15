import { count } from "drizzle-orm";
import db from "../db";
import { user } from "../db/schema";
import { procedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const isSetup = async () => (await db.select().from(user).limit(1)).length > 0;
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
                    .insert(user)
                    .values({ ...input, role: "OWNER" })
                    .returning({ insertedId: user.id });

                if (result.length !== 1)
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Could not create user",
                    });
                const userId = result[0]!.insertedId;
                // TODO: Send activation email
            } catch (e) {
                console.error(e);
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }
        }),
});
