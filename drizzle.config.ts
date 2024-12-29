import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./src/lib/server/db/drizzle/",
    schema: "./src/lib/server/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
    strict: true,
});
