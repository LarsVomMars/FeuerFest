import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { RoleValue } from "$lib/db/types";

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.request.validateSession();
    if (!session) throw redirect(302, "/auth/login");
    const role = RoleValue[session!.user.role];
    if (role < RoleValue.ADMIN) throw redirect(302, "/");
};
