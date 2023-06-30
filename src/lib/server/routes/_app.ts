import { router, procedure } from "../trpc";
import { z } from "zod";

export const appRouter = router({});

export type AppRouter = typeof appRouter;
