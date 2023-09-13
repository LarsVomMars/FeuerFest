import db from "$lib/db";
import { TRPCError } from "@trpc/server";
import { owner, user } from "../middleware";
import { router } from "../trpc";
import { z } from "zod";
import { comparePassword, hashPassword } from "$lib/util/password";
import { createActivationToken } from "$lib/util/tokens";
import { sendMailWithHTML } from "$lib/util/mail";
import { Status } from "$lib/db/types";

const sendActivationMail = async (
    id: number,
    base: string,
    email: string,
    name: string,
) => {
    const token = createActivationToken(id);
    const url = new URL(`/auth/activate/${token}`, base);

    await sendMailWithHTML(
        email,
        "Willkommen bei FeuerFest",
        `<h1>Hallo ${name},</h1><p>Willkommen bei FeuerFest!<br/>Bitte bestätige deine Email:<br/> <a href="${url}"><button>Bestätigen</button></a></p>`,
    );
};

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
    create: owner
        .input(
            z.object({
                name: z.string(),
                username: z.string(),
                email: z.string().email(),
                dummy: z.boolean(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { dummy, ...data } = input;

            const inserted = await db
                .insertInto("User")
                .values({ ...data, dummy: Number(dummy) })
                .execute();
            if (!inserted || inserted.length === 0)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create user.",
                });

            // Only send email to non-dummy users
            if (dummy) return inserted[0]!.insertId;

            const id = Number(inserted[0]!.insertId);
            await sendActivationMail(
                id,
                ctx.event.url.origin,
                data.email,
                data.name,
            );
            return inserted[0]!.insertId;
        }),
    undummify: owner
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const { id } = input;

            const user = await db
                .selectFrom("User")
                .where("id", "=", id)
                .select(["email", "name", "status", "dummy"])
                .executeTakeFirst();

            if (!user) throw new TRPCError({ code: "NOT_FOUND" });
            if (!user.dummy || user.status !== Status.PENDING)
                throw new TRPCError({ code: "BAD_REQUEST" });

            await db
                .updateTable("User")
                .set({ dummy: 0 })
                .where("id", "=", id)
                .execute();

            await sendActivationMail(
                id,
                ctx.event.url.origin,
                user.email,
                user.name,
            );
        }),
    activate: owner
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const { id } = input;

            const user = await db
                .selectFrom("User")
                .where("id", "=", id)
                .select(["email", "name", "status", "dummy", "password"])
                .executeTakeFirst();

            if (!user) throw new TRPCError({ code: "NOT_FOUND" });
            if (user.dummy || user.status === Status.ACTIVE)
                throw new TRPCError({ code: "BAD_REQUEST" });

            await db
                .updateTable("User")
                .set({ status: Status.ACTIVE })
                .where("id", "=", id)
                .execute();

            // Resend activation email if user has no password -> not initialized yet
            if (!user.password) {
                await sendActivationMail(
                    id,
                    ctx.event.url.origin,
                    user.email,
                    user.name,
                );
            }
        }),
    deactivate: owner
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
            const { id } = input;

            const user = await db
                .selectFrom("User")
                .where("id", "=", id)
                .select(["email", "name", "status", "dummy"])
                .executeTakeFirst();

            if (!user) throw new TRPCError({ code: "NOT_FOUND" });
            if (user.dummy || user.status !== Status.ACTIVE)
                throw new TRPCError({ code: "BAD_REQUEST" });

            await db
                .updateTable("User")
                .set({ status: Status.INACTIVE })
                .where("id", "=", id)
                .execute();
        }),
    list: owner.query(async () => {
        return await db
            .selectFrom("User")
            .orderBy("name")
            .select(["id", "name", "email", "username", "dummy"])
            .execute()!;
    }),
    get: owner.input(z.object({ id: z.number() })).query(async ({ input }) => {
        const { id } = input;
        const user = await db
            .selectFrom("User")
            .where("id", "=", id)
            .select([
                "id",
                "name",
                "email",
                "username",
                "dummy",
                "status",
                "role",
            ])
            .executeTakeFirst();
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });
        return user;
    }),
});
