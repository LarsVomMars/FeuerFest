import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { RoleValue } from "$lib/db/types";
import { trpcServer } from "$lib/server/server";

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.request.validateSession();
    if (!session) throw redirect(302, "/auth/login");
    const role = RoleValue[session!.user.role];
    if (role < RoleValue.OWNER) throw redirect(302, "/");

    try {
        await trpcServer.users.list.ssr(event);
    } catch (e) {
        console.error(e);
    }
};
