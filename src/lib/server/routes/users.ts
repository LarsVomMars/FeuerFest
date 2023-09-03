import db from "$lib/db";
import { TRPCError } from "@trpc/server";
import { user } from "../middleware";
import { router } from "../trpc";
import { z } from "zod";
import { comparePassword, hashPassword } from "$lib/util/password";

export default router({
    me: user.query(async ({ ctx }) => {
        const id = ctx.session.user.id;
        const user = await db
            .selectFrom("User")
            .where("id", "=", id)
            .select(["id", "name", "email", "username"])
            .executeTakeFirst();
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });
        return user;
    }),
    updateMe: user
        .input(
            z.object({
                id: z.number(),
                name: z.string(),
                username: z.string(),
                email: z.string().email(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            if (id !== ctx.session.user.id)
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You cannot update another user.",
                });

            await db
                .updateTable("User")
                .set(data)
                .where("id", "=", id)
                .execute();
        }),
    updatePassword: user
        .input(
            z.object({
                currentPassword: z.string().min(8),
                newPassword: z.string().min(8),
                validateNewPassword: z.string().min(8),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { currentPassword, newPassword, validateNewPassword } = input;
            if (newPassword !== validateNewPassword)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Passwords do not match.",
                });

            const user = await db
                .selectFrom("User")
                .where("id", "=", ctx.session.user.id)
                .select(["password", "id", "name", "role"])
                .executeTakeFirst();
            if (!user) throw new TRPCError({ code: "NOT_FOUND" });
            if (!(await comparePassword(currentPassword, user.password || "")))
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Current password is incorrect.",
                });

            await db
                .updateTable("User")
                .set({ password: await hashPassword(newPassword) })
                .where("id", "=", ctx.session.user.id)
                .execute();
        }),
});
