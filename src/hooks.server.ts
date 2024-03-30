import lucia, { setSessionCookie } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get(lucia.sessionCookieName);

    if (!sessionId) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (!session) {
        const cookie = lucia.createBlankSessionCookie();
        setSessionCookie(event.cookies, cookie);
    } else if (session.fresh) {
        const cookie = lucia.createSessionCookie(session.id);
        setSessionCookie(event.cookies, cookie);
    }

    event.locals.user = user;
    event.locals.session = session;
    return resolve(event);
};