import { verifySessionToken } from "$lib/util/tokens";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const session: Handle = async ({ event, resolve }) => {
    const session = event.cookies.get("session");
    if (session) {
        try {
            event.locals.user = await verifySessionToken(session);
        } catch (e) {
            event.locals.user = undefined;
            event.cookies.delete("session");
        }
    }

    return resolve(event);
};

export const handle: Handle = sequence(session);
