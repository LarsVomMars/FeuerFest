import { RoleValue } from "$lib/db/types";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { trpcServer } from "$lib/server/server";

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.request.validateSession();
    const role = RoleValue[session!.user.role];
    if (role < RoleValue.OWNER) throw redirect(302, "/");

    const id = Number(event.params.id);
    if (isNaN(id)) throw redirect(302, "/users");

    // if (id === session!.user.id) throw redirect(302, "/users/me");

    try {
        await trpcServer.users.get.ssr({ id }, event);
    } catch (e) {
        console.error(e);
    }
};
