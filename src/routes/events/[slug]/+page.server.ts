import type { PageServerLoad } from "./$types";
import { trpcServer } from "$lib/server/server";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) throw redirect(302, "/auth/login");
    if (!event.params.slug) throw redirect(302, "/events");

    try {
        await trpcServer.events.get.ssr({ ...event.params }, event);
    } catch (e) {
        console.error(e);
        throw redirect(302, "/events");
    }
};
