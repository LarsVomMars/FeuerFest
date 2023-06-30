import { Kysely, MysqlDialect } from "kysely";
import { DATABASE_URL } from "$env/static/private";
import type { DB } from "./schema";
import { createPool } from "mysql2/promise";

export const db = new Kysely<DB>({
    dialect: new MysqlDialect({
        pool: createPool(DATABASE_URL),
    }),
});
