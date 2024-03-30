import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";
import lucia from "./auth";

export async function createContext(event: RequestEvent) {
    const cookie = event.cookies.get(lucia.sessionCookieName);
    const { session, user } = await lucia.validateSession(cookie ?? "");
    return { event, session, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
