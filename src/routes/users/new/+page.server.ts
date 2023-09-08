import { RoleValue } from "$lib/db/types";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
    const session = (await event.locals.request.validateSession())!;
    if (RoleValue[session.user.role] < RoleValue.OWNER)
        throw redirect(302, "/");
};
