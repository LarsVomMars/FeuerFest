import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.request.validateSession();
    if (!session) throw redirect(302, "/auth/login");
    return { user: session.user };
};
