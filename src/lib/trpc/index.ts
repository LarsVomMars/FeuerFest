import { createTRPCSvelte } from "trpc-svelte-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "$lib/server/routes/_app";
import { transformer } from "./transformer";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const trpc = createTRPCSvelte<AppRouter>({
    links: [
        httpBatchLink({
            url: "/api/trpc",
            transformer,
        }),
    ],
});

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
