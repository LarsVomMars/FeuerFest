import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { trpcServer } from "$lib/server/server";

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.request.validateSession();
    try {
        await trpcServer.events.listActive.ssr(event);
        await trpcServer.events.listPast.ssr(event);
        await trpcServer.events.listUpcoming.ssr(event);
    } catch (error) {
        console.error(error);
        throw redirect(302, "/");
    }
    return { user: session!.user };
};
