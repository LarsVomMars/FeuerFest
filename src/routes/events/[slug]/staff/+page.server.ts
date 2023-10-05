import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { trpcServer } from "$lib/server/server";

export const load: PageServerLoad = async (event) => {
    // TODO: Find better way using parent?
    const slug = event.params.slug;
    try {
        await trpcServer.events.staff.list.ssr({ event: slug }, event);
    } catch (error) {
        console.error(error);
        throw redirect(302, "/events");
    }
};
