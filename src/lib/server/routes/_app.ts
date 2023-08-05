import { router } from "../trpc";
import auth from "./auth";
import setup from "./setup";

export const appRouter = router({ auth, setup });

export type AppRouter = typeof appRouter;
