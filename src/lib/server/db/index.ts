import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "$env/dynamic/private";

const client = postgres(env.DATABASE_URL);
console.log("DATABASE_URL", env.DATABASE_URL);

const db = drizzle(client, { schema });

export default db;
