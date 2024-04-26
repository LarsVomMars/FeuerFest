import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { trpcServer } from "$lib/server/server";

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) throw redirect(302, "/auth/login");
    const slug = event.params.slug;
    if (!slug) throw redirect(302, "/events");
    try {
        await trpcServer.events.get.ssr({ slug }, event);
        await trpcServer.events.products.list.ssr({ slug }, event);
    } catch (e) {
        console.error(e);
        throw redirect(302, `/events/${slug}`);
    }
};
