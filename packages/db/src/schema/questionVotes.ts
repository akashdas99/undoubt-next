import { InferSelectModel } from "drizzle-orm";
import { index, integer, pgTable, uuid, unique } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../helpers/timestamps.js";
import { questions } from "./questions.js";
import { users } from "./users.js";

export const questionVotes = pgTable(
  "question_votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    vote: integer("vote").notNull(),
    createdAt,
    updatedAt,
  },
  (table) => ({
    userQuestionUnique: unique().on(table.userId, table.questionId),
    questionIdIdx: index("question_votes_question_id_idx").on(table.questionId),
    userIdIdx: index("question_votes_user_id_idx").on(table.userId),
  }),
);

export type QuestionVote = InferSelectModel<typeof questionVotes>;