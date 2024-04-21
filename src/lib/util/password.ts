import { Argon2id } from "oslo/password";

const argon = new Argon2id();

export const hash = (password: string) => argon.hash(password);

export const verify = (password: string, hash: string) =>
    argon.verify(hash, password);
