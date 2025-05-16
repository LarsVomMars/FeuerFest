import { trpcServer } from "$lib/server/server";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    try {
        await trpcServer.setup.isSetup.ssr();
    } catch (e) {
        console.error(e);
        throw redirect(302, "/");
    }
};
