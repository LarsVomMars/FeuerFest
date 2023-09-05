import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { trpcServer } from "$lib/server/server";

export const load: PageServerLoad = async (event) => {
    const slug = event.params.slug;
    try {
        await trpcServer.events.getBySlug.ssr({ slug }, event);
    } catch (error) {
        console.error(error);
        throw redirect(302, "/events");
    }
};