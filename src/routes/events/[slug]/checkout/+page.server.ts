import { trpcServer } from "$lib/server/server";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
    const slug = event.params.slug;
    try {
        await trpcServer.events.products.list.ssr({ event: slug! }, event);
    } catch (e) {
        console.error(e);
        throw redirect(302, "/events");
    }
};
