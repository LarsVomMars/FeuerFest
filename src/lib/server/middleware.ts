import { TRPCError } from "@trpc/server";
import { middleware, procedure } from "./trpc";

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
