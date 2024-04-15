import { procedure, router } from "../trpc";
import z from "zod";
import db from "../db";
import { user } from "../db/schema";
import lucia, { setSessionCookie } from "../auth";
import { eq } from "drizzle-orm";
import setup from "./setup";

export const appRouter = router({
    setup,
    login: procedure
        .input(z.object({ username: z.string(), password: z.string() }))
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await db
                    .select()
                    .from(user)
                    .where(eq(user.username, input.username));

                if (!result) {
                    return;
                }

                const users = result[0];

                if (!users || users.password !== input.password) {
                    return;
                }

                const session = await lucia.createSession(users.id, {});
                const cookie = lucia.createSessionCookie(session.id);
                setSessionCookie(ctx.event.cookies, cookie);
            } catch (error) {
                console.error(error);
            }
        }),
    register: procedure
        .input(
            z.object({
                username: z.string(),
                password: z.string(),
                name: z.string(),
                email: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await db
                    .insert(user)
                    .values({ ...input })
                    .returning({ id: user.id });
                const userId = result[0]!.id;

                const session = await lucia.createSession(userId, {});
                const cookie = lucia.createSessionCookie(session.id);
                setSessionCookie(ctx.event.cookies, cookie);
            } catch (error) {
                console.error(error);
            }
        }),
});

export type AppRouter = typeof appRouter;
