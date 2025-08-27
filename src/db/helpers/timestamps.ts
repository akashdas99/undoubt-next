import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const createdAt = timestamp("created_at")
  .notNull()
  .default(sql`CURRENT_TIMESTAMP`);
export const updatedAt = timestamp("updated_at")
  .notNull()
  .default(sql`CURRENT_TIMESTAMP`)
  .$onUpdate(() => sql`CURRENT_TIMESTAMP`);
