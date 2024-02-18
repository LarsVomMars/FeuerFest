import { TRPCError } from "@trpc/server";
import { middleware, procedure } from "./trpc";
import { Role, RoleValue } from "$lib/db/types";
import db from "$lib/db";

const loggedIn = middleware(async ({ ctx, next }) => {
    const { session } = ctx;
    if (!session)
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to do that.",
        });

    return next({ ctx: { ...ctx, session } });
});

export const user = procedure.use(loggedIn);

const isAdmin = middleware(async ({ ctx, next }) => {
    const { session } = ctx;
    if (!session)
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to do that.",
        });
    if (RoleValue[session.user.role] < RoleValue.ADMIN)
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be an admin to do that.",
        });

    return next({ ctx: { ...ctx, session } });
});

export const admin = procedure.use(isAdmin);

const isOwner = middleware(async ({ ctx, next }) => {
    const { session } = ctx;
    if (!session)
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to do that.",
        });
    if (RoleValue[session.user.role] < RoleValue.OWNER)
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be an owner to do that.",
        });

    return next({ ctx: { ...ctx, session } });
});

export const owner = procedure.use(isOwner);

export const isEventUser = async (event: string, user: number) => {
    const eventUser = await db
        .selectFrom("EventStaff")
        .where("slug", "=", event)
        .where("userId", "=", user)
        .selectAll()
        .executeTakeFirst();
    return !!eventUser;
};

export const isEventAdmin = async (event: string, user: number) => {
    const eventUser = await db
        .selectFrom("EventStaff")
        .where("slug", "=", event)
        .where("userId", "=", user)
        .selectAll()
        .executeTakeFirst();
    if (!eventUser) return false;
    return RoleValue[eventUser.role] >= RoleValue.ADMIN;
};
