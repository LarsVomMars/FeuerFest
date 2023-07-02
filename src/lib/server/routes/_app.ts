import { router } from "../trpc";
import auth from "./auth";

export const appRouter = router({ auth });

export type AppRouter = typeof appRouter;
