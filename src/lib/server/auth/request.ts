import { Role, Status } from "$lib/db";
import type { RequestEvent } from "@sveltejs/kit";
import type { Session } from "./session";
import {
    createUserSession,
    deleteSessionById,
    deleteSessionByToken,
    getSessionByToken,
} from "./db";
import { generateSessionId, getExpirationDate } from "$lib/util/auth";

const SESSION_COOKIE_NAME = "session";

export class Request {
    private event: RequestEvent;

    constructor(event: RequestEvent) {
        this.event = event;
    }

    public async validateSession(): Promise<Session | null> {
        const sessionToken = this.event.cookies.get(SESSION_COOKIE_NAME);
        if (!sessionToken) return null;

        const session = await getSessionByToken(sessionToken);

        if (!session) {
            this.event.cookies.delete(SESSION_COOKIE_NAME);
            return null;
        }

        // Revoked sessions?
        if (
            session.expiresAt < new Date() ||
            session.status !== Status.ACTIVE
        ) {
            this.event.cookies.delete(SESSION_COOKIE_NAME);
            // sessionId instead of userId? -> modify query
            await deleteSessionById(session.id);
            return null;
        }

        const sessionData = {
            id: session.token,
            user: {
                id: session.userId,
                username: session.username,
                name: session.name,
                email: session.email,
                role: session.role as Role,
            },
        } satisfies Session;

        return sessionData;
    }

    public async createSession(userId: number) {
        const sessionId = generateSessionId();
        const expirationDate = getExpirationDate();
        const session = await createUserSession(
            sessionId,
            userId,
            expirationDate,
        );
        if (!session) return;
        this.setSession(session.token, session.expiresAt);
    }

    private setSession(session: string, expiresAt: Date) {
        this.event.cookies.set(SESSION_COOKIE_NAME, session, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: expiresAt.getTime() - Date.now(),
        });
    }

    public async clearSession() {
        const session = this.event.cookies.get(SESSION_COOKIE_NAME);
        if (!session) return;
        this.event.cookies.delete(SESSION_COOKIE_NAME);
        await deleteSessionByToken(session);
    }
}
