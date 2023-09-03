import { randomBytes } from "crypto";

const SESSION_EXPIRATION_TIME = 1 * 24 * 60 * 60 * 1000;

export const generateSessionId = () => randomBytes(32).toString("hex");
export const getExpirationDate = () =>
    new Date(Date.now() + SESSION_EXPIRATION_TIME);
