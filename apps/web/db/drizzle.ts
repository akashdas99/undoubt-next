import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DB_POOL_MAX } from "@/lib/constants";

const globalForDb = globalThis as unknown as { pool?: Pool };

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URI,
    max: DB_POOL_MAX,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export const db = drizzle({ client: pool });
