import { V3 } from "paseto";
import { env } from "$env/dynamic/private";
import { randomBytes } from "crypto";

// NOTE: libsodium when? :D
const SIGNING_KEY = Buffer.from(
    env.SIGNING_KEY || randomBytes(32).toString("hex"),
    "hex",
);
const SIGNING_OPTIONS = {
    expiresIn: "1d",
    issuer: "FeuerFest",
    audience: "urn:feuerfest:client",
};

const encrypt = <T extends Record<string, unknown>>(data: T) =>
    V3.encrypt(data, SIGNING_KEY, SIGNING_OPTIONS);

const decrypt = <T extends Record<string, unknown>>(token: string) =>
    V3.decrypt<T>(token, SIGNING_KEY, SIGNING_OPTIONS);

export const createActivationToken = (id: number) =>
    encrypt<ActivationToken>({ id });
export const verifyActivationToken = (token: string) =>
    decrypt<ActivationToken>(token);

export type ActivationToken = {
    id: number;
};
