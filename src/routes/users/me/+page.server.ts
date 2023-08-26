import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { trpcServer } from "$lib/server/server";

export const load: PageServerLoad = async (event) => {
    try {
        await trpcServer.users.me.ssr(event);
    } catch (e) {
        console.error(e);
        throw redirect(302, "/auth/login");
    }
};
