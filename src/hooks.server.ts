import { handleRequest } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const session: Handle = async ({ event, resolve }) => {
    event.locals.request = handleRequest(event);
    return resolve(event);
};

export const handle: Handle = sequence(session);
