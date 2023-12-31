import type { Role } from "$lib/db/types";

export type SessionUser = {
    id: number;
    username: string;
    name: string;
    email: string;
    role: Role; // NOTE: Use RoleValue instead?
};

export type Session = {
    id: string;
    user: SessionUser;
};
