import { Kysely, MysqlDialect } from "kysely";
import { env } from "$env/dynamic/private";
import type { DB } from "./schema";
import { createPool } from "mysql2";

const db = new Kysely<DB>({
    dialect: new MysqlDialect({
        pool: createPool({ uri: env.DATABASE_URL }),
    }),
});

export default db;
