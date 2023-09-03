import type { RequestEvent } from "@sveltejs/kit";
import { Request } from "./request";
import type { Session } from "./session";
import { randomBytes } from "crypto";
import { createUserSession, deleteSessionByToken } from "./db";

const SESSION_EXPIRATION_TIME = 1 * 24 * 60 * 60 * 1000;

const generateSessionId = () => randomBytes(32).toString("hex");

const getExpirationDate = () => new Date(Date.now() + SESSION_EXPIRATION_TIME);

export const handleRequest = (event: RequestEvent) => new Request(event);

export const createSession = (userId: number) => {
    const sessionId = generateSessionId();
    const expirationDate = getExpirationDate();
    return createUserSession(sessionId, userId, expirationDate);
};

export const destroySession = async (session: Session) =>
    deleteSessionByToken(session.id);
