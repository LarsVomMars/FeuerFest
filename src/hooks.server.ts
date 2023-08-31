import auth from "$lib/auth";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const session: Handle = async ({ event, resolve }) => {
    const request = auth.handleRequest(event);
    event.locals.request = request;
    return resolve(event);
};

export const handle: Handle = sequence(session);
