import { initTRPC } from "@trpc/server";
import type { Context } from "./context";
import { transformer } from "$lib/trpc/transformer";

const t = initTRPC.context<Context>().create({
    transformer,
});

export const router = t.router;
export const middleware = t.middleware;
export const procedure = t.procedure;
