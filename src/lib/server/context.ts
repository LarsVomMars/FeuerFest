import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";

export async function createContext(event: RequestEvent) {
    const session = await event.locals.request.validateSession();
    return { event, session };
}

export type Context = inferAsyncReturnType<typeof createContext>;
