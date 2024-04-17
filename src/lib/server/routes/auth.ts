import { parseToken } from "$lib/util/token";
import { TRPCError } from "@trpc/server";
import { procedure, router } from "../trpc";
import { z } from "zod";
import db from "../db";
import { userTable } from "../db/schema";
import { and, eq } from "drizzle-orm";

export default router({
    validateToken: procedure
        .input(z.object({ token: z.string() }))
        .query(async ({ input }) => {
            try {
                return await parseToken(input.token);
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid token",
                });
            }
        }),
    activate: procedure
        .input(
            z.object({
                token: z.string(),
                password: z.string().min(8),
                username: z.string(),
                validatePassword: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            if (input.password !== input.validatePassword) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Passwords do not match",
                });
            }

            let data;
            try {
                data = await parseToken(input.token);

                if (data.type !== "activation")
                    throw new Error("Invalid token type");

                const result = await db
                    .select()
                    .from(userTable)
                    .where(
                        and(
                            eq(userTable.id, data.userId),
                            eq(userTable.email, data.email),
                        ),
                    );

                if (!result) throw new Error("User not found");
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid token",
                });
            }

            // TODO: Hash password
            const hash = input.password;
            await db
                .update(userTable)
                .set({
                    password: hash,
                    username: input.username,
                    status: "ACTIVE",
                })
                .where(eq(userTable.id, data.userId));
        }),
});
