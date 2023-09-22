import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { trpcServer } from "$lib/server/server";

export const load: PageServerLoad = async (event) => {
    try {
        const token = event.params.token;
        if (!token) throw new Error("No token");
        await trpcServer.auth.validateResetToken.ssr({ token }, event);
    } catch (e) {
        console.error(e);
        throw redirect(302, "/");
    }
};
