import { router } from "../trpc";
import setup from "./setup";
import auth from "./auth";
import events from "./events";

export const appRouter = router({ setup, auth, events });

export type AppRouter = typeof appRouter;
