import { TRPCError } from "@trpc/server";
import { middleware, procedure } from "./trpc";
import { RoleValue } from "$lib/db/types";

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
