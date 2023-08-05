import { trpcServer } from "$lib/server/server";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
    try {
        await trpcServer.setup.isSetup.ssr(event);
    } catch (e) {
        console.error(e);
        throw redirect(301, "/");
    }
};
