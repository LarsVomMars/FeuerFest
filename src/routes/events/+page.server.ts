import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { trpcServer } from "$lib/server/server";

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) throw redirect(302, "/auth/login");
    try {
        await trpcServer.events.listActive.ssr();
        await trpcServer.events.listPast.ssr();
        await trpcServer.events.listUpcoming.ssr();
    } catch (e) {
        console.error(e);
        throw redirect(302, "/");
    }
    return { role: event.locals.user.role };
};
