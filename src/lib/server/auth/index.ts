import { Cookie, Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import db from "../db";
import { session, user } from "../db/schema";
import { dev } from "$app/environment";
import type { Cookies } from "@sveltejs/kit";

const adapter = new DrizzlePostgreSQLAdapter(db, session, user);

const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: !dev,
        },
    },

    getUserAttributes: (user) => ({
        email: user.email,
        name: user.name,
        username: user.username,
        dummy: user.dummy,
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
            typeof user.$inferSelect,
            "id" | "password"
        >;
        UserId: number;
    }
}
