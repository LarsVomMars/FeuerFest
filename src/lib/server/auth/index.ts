import { Cookie, Lucia, TimeSpan } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import db from "../db";
import { sessionTable, userTable } from "../db/schema";
import { dev } from "$app/environment";
import type { Cookies } from "@sveltejs/kit";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: !dev,
        },
    },
    sessionExpiresIn: new TimeSpan(1, "d"),

    getUserAttributes: (user) => ({
        email: user.email,
        name: user.name,
        username: user.username,
        dummy: user.dummy,
        role: user.role,
        status: user.status,
    }),
});

export default lucia;

export const setSessionCookie = (cookies: Cookies, session: Cookie) => {
    cookies.set(session.name, session.value, {
        path: ".",
        ...session.attributes,
    });
};

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: Omit<
            typeof userTable.$inferSelect,
            "id" | "password"
        >;
        UserId: number;
    }
}
