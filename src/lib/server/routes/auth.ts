import db, { Status } from "$lib/db";
import { verifyActivationToken, type ActivationToken } from "$lib/util/tokens";
import { TRPCError } from "@trpc/server";
import { procedure, router } from "../trpc";
import { z } from "zod";
import { comparePassword, hashPassword } from "$lib/util/password";

const getTokenUser = async (token: string) => {
    const { id } = await verifyActivationToken(token);
    const user = await db
        .selectFrom("User")
        .where("id", "=", id)
        .select(["id", "name", "email", "status"])
        .executeTakeFirst();
    if (!user) throw new Error("User not found");
    if (user.status !== Status.PENDING)
        throw new Error("User already activated");
    return user;
};

export default router({
    validateToken: procedure
        .input(z.object({ token: z.string() }))
        .query(async ({ input: { token } }) => {
            try {
                const user = await getTokenUser(token);
                return { user };
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
                name: z.string(),
                username: z.string(),
                email: z.string().email(),
                password: z.string().min(8),
                validatePassword: z.string().min(8),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            let user: ActivationToken;
            try {
                user = await getTokenUser(input.token);
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid token",
                });
            }

            if (input.password !== input.validatePassword)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Passwords do not match",
                });

            const password = await hashPassword(input.password);

            await db
                .updateTable("User")
                .set({
                    name: input.name,
                    username: input.username,
                    email: input.email,
                    password,
                    status: Status.ACTIVE,
                    updatedAt: new Date(),
                })
                .where("id", "=", user.id)
                .execute();
            await ctx.event.locals.request.createSession(user.id);
        }),
    login: procedure
        .input(z.object({ username: z.string(), password: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const user = await db
                .selectFrom("User")
                .where("username", "=", input.username)
                .selectAll()
                .executeTakeFirst();

            if (
                !user ||
                !user.password ||
                !(await comparePassword(input.password, user.password))
            )
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid username or password",
                });

            if (user.status !== Status.ACTIVE)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User is not active",
                });
            await ctx.event.locals.request.createSession(user.id);
        }),
    logout: procedure.mutation(async ({ ctx }) => {
        await ctx.event.locals.request.clearSession();
    }),
});
