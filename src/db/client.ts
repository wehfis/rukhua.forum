import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

let cachedDb: PostgresJsDatabase<typeof schema> | null = null;
let cachedSql: postgres.Sql | null = null;

export function getDb() {
  if (!env.DATABASE_URL) {
    return null;
  }

  if (!cachedDb) {
    cachedSql = postgres(env.DATABASE_URL, {
      max: 1,
      prepare: false
    });
    cachedDb = drizzle(cachedSql, { schema });
  }

  return cachedDb;
}

export async function closeDb() {
  if (cachedSql) {
    await cachedSql.end();
  }
}
