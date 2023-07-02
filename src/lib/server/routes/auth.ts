import { procedure, router } from "../trpc";
import { z } from "zod";

export default router({
    login: procedure
        .input(z.object({ username: z.string(), password: z.string() }))
        .mutation(({ input, ctx }) => {
            // TODO: Login
        }),
});
