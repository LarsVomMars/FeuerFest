import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { trpcServer } from "$lib/server/server";

export const load: PageServerLoad = async (event) => {
    const { token } = event.params;
    if (!token) throw redirect(302, "/auth/login");
    try {
        await trpcServer.auth.validateToken.ssr({ token }, event);
    } catch (e) {
        console.error(e);
        throw redirect(302, "/auth/login");
    }
};
