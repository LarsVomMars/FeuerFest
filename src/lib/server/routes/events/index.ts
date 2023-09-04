import db from "$lib/db";
import { user } from "$lib/server/middleware";
import { router } from "$lib/server/trpc";

export default router({
    listActive: user.query(async () => {
        const now = new Date();
        const events = await db
            .selectFrom("Event")
            .where("start", "<=", now)
            .where("end", ">=", now)
            .orderBy("start", "asc")
            .selectAll()
            .execute();
        return events;
    }),
    listPast: user.query(async () => {
        const now = new Date();
        const events = await db
            .selectFrom("Event")
            .where("end", "<", now)
            .orderBy("start", "desc")
            .selectAll()
            .execute();
        return events;
    }),
    listUpcoming: user.query(async () => {
        const now = new Date();
        const events = await db
            .selectFrom("Event")
            .where("start", ">", now)
            .orderBy("start", "asc")
            .selectAll()
            .execute();
        return events;
    }),
});
