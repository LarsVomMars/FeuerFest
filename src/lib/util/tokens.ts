import { V3 } from "paseto";
import { env } from "$env/dynamic/private";
import { randomBytes } from "crypto";

// NOTE: libsodium when? :D
const SIGNING_KEY = Buffer.from(
    env.SIGNING_KEY || randomBytes(32).toString("hex"),
    "hex",
);

const createSigningOptions = (expires = "1d") => ({
    expiresIn: expires,
    issuer: "FeuerFest",
    audience: "urn:feuerfest:client",
});

export type TokenType = "activation" | "reset";
export enum TokenTypes {
    ACTIVATION = "activation",
    RESET = "reset",
}

export type Token = {
    type: TokenType;
    id: number;
    email: string;
};

export const createToken = (
    id: number,
    email: string,
    type: TokenType,
    expires = "1d",
) =>
    V3.encrypt({ id, email, type }, SIGNING_KEY, createSigningOptions(expires));

export const verifyToken = (token: string, expires = "1d") =>
    V3.decrypt<Token>(token, SIGNING_KEY, createSigningOptions(expires));
