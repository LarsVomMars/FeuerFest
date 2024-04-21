import { router } from "../trpc";
import setup from "./setup";
import auth from "./auth";

export const appRouter = router({ setup, auth });

export type AppRouter = typeof appRouter;
