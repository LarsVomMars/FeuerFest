import { router } from "../trpc";
import auth from "./auth";
import setup from "./setup";
import users from "./users";
import events from "./events";

export const appRouter = router({ auth, setup, users, events });

export type AppRouter = typeof appRouter;
