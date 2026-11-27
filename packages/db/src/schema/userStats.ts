import { InferSelectModel, sql } from "drizzle-orm";
import { check, index, integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const userStats = pgTable(
  "user_stats",
  {
    userId: uuid("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    questionCount: integer("question_count").notNull().default(0),
    answerCount: integer("answer_count").notNull().default(0),
  },
  (table) => [
    check(
      "user_stats_counts_non_negative",
      sql`${table.questionCount} >= 0 AND ${table.answerCount} >= 0`,
    ),
    index("user_stats_contribution_idx").on(
      sql`${table.questionCount} + ${table.answerCount}`,
    ),
  ],
);

export type UserStats = InferSelectModel<typeof userStats>;
