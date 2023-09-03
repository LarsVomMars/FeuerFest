import type { Role } from "$lib/db";

export type SessionUser = {
    id: number;
    username: string;
    name: string;
    email: string;
    role: Role;
};

export type Session = {
    id: string;
    user: SessionUser;
};
