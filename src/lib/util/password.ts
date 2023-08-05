import { hash, compare } from "bcrypt";

const ROUNDS = 12;

export const hashPassword = (password: string) => hash(password, ROUNDS);
export const comparePassword = (password: string, hash: string) =>
    compare(password, hash);
