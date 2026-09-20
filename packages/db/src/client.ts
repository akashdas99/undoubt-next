import { neon, Pool } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";

export function createHttpDb(databaseUri: string) {
  const sql = neon(databaseUri);
  return drizzleHttp({ client: sql });
}

export function createPoolDb(databaseUri: string) {
  const pool = new Pool({ connectionString: databaseUri });
  return drizzleNeon({ client: pool });
}
