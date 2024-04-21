import { parseToken } from "$lib/util/token";
import { TRPCError } from "@trpc/server";
import { procedure, router } from "../trpc";
import { z } from "zod";
import db from "../db";
import { userTable } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { hash, verify } from "$lib/util/password";
import lucia, { setSessionCookie } from "../auth";

const getActivationTokenUser = async (token: string) => {
    const { userId, email, type } = await parseToken(token);
    if (type !== "activation") throw new Error("Invalid token type");
    const user = await db
        .select({
            id: userTable.id,
            email: userTable.email,
            name: userTable.name,
            username: userTable.username,
        })
        .from(userTable)
        .where(
            and(
                eq(userTable.id, userId),
                eq(userTable.email, email),
                eq(userTable.status, "PENDING"),
            ),
        );

    if (!user || user.length !== 1) throw new Error("User not found");
    return user[0]!;
};

export default router({
    validateActivationToken: procedure
        .input(z.object({ token: z.string() }))
        .query(async ({ input }) => {
            try {
                return await getActivationTokenUser(input.token);
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
                email: z.string(),
                name: z.string(),
                username: z.string(),
                password: z.string().min(8),
                validatePassword: z.string().min(8),
            }),
        )
        .mutation(async ({ input }) => {
            if (input.password !== input.validatePassword) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Passwords do not match",
                });
            }

            let user;
            try {
                user = await getActivationTokenUser(input.token);
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid token",
                });
            }

            const password = await hash(input.password);
            await db
                .update(userTable)
                .set({
                    password,
                    email: input.email,
                    name: input.name,
                    username: input.username,
                    status: "ACTIVE",
                    updatedAt: new Date(),
                })
                .where(eq(userTable.id, user.id));
        }),
    login: procedure
        .input(z.object({ username: z.string(), password: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await db
                    .select()
                    .from(userTable)
                    .where(
                        and(
                            eq(userTable.username, input.username),
                            eq(userTable.status, "ACTIVE"),
                            eq(userTable.dummy, false),
                        ),
                    );
                if (!result || result.length !== 1) {
                    throw new Error("User not found");
                }
                const user = result[0]!;

                const valid = await verify(input.password, user.password);
                if (!valid) {
                    throw new Error("Invalid password");
                }

                const session = await lucia.createSession(user.id, {});
                const cookie = lucia.createSessionCookie(session.id);
                setSessionCookie(ctx.event.cookies, cookie);
            } catch (error) {
                console.error(error);
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid username or password",
                });
            }
        }),
    logout: procedure.mutation(async ({ ctx }) => {
        try {
            const cookie = ctx.event.cookies.get(lucia.sessionCookieName);
            if (cookie) {
                await lucia.invalidateSession(cookie);
            }
        } catch (error) {
            console.error(error);
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to logout",
            });
        }
    }),
});
