import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { trpcServer } from "$lib/server/server";

export const load: PageServerLoad = async (event) => {
    if (event.locals.user) return redirect(302, "/");
    if (!event.params.token) return redirect(302, "/");
    try {
        const token = event.params.token;
        await trpcServer.auth.validateActivationToken.ssr({ token });
    } catch (e) {
        console.error(e);
        throw redirect(302, "/");
    }
};
