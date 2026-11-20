import { DB_POOL_MAX } from "@workspace/constants";
import type { Database } from "@workspace/db";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as unknown as { pool?: Pool };

function createPool() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URI,
    max: DB_POOL_MAX,
  });

  pool.on("error", (error) => {
    console.error("Unexpected error on idle pg client:", error);
  });

  return pool;
}

const pool = globalForDb.pool ?? createPool();

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export const db: Database = drizzle({ client: pool });
