import { verifySessionToken, type SessionToken } from "$lib/util/tokens";
import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";

export async function createContext(opts: RequestEvent) {
    const session = opts.cookies.get("session");
    let user: SessionToken | undefined;
    try {
        if (session) user = await verifySessionToken(session);
    } catch (e) {
        user = undefined;
        opts.cookies.delete("session");
    }
    return { host: opts.url.origin, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
