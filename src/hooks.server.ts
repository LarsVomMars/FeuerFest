import { Request } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const session: Handle = async ({ event, resolve }) => {
    event.locals.request = new Request(event);
    return resolve(event);
};

export const handle: Handle = sequence(session);
