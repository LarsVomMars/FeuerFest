import { router } from "../trpc";
import auth from "./auth";
import setup from "./setup";
import users from "./users";

export const appRouter = router({ auth, setup, users });

export type AppRouter = typeof appRouter;
