import { env } from "$env/dynamic/private";
import { TimeSpan } from "oslo";
import { createJWT, validateJWT } from "oslo/jwt";
import { randomBytes } from "crypto";

const SIGNING_KEY = new Uint8Array(
    Buffer.from(env.SIGNING_KEY || randomBytes(32).toString("hex"), "hex"),
);

const EXPIRATION = new TimeSpan(7, "d");
const ISSUER = "FeuerFest";
const ALGORITHM = "HS512";

type TokenType = "activation" | "reset";

type Token = {
    type: TokenType;
    userId: number;
    email: string;
};

const createToken = async (type: TokenType, userId: number, email: string) =>
    createJWT(
        ALGORITHM,
        SIGNING_KEY,
        { type, userId, email },
        { issuer: ISSUER, expiresIn: EXPIRATION },
    );

export const createActivationToken = async (userId: number, email: string) =>
    createToken("activation", userId, email);

export const createResetToken = async (userId: number, email: string) =>
    createToken("reset", userId, email);

export const parseToken = async (token: string) =>
    (await validateJWT(ALGORITHM, SIGNING_KEY, token)).payload as Token;
