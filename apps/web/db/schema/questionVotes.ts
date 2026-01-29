import { InferSelectModel, relations } from "drizzle-orm";
import { index, integer, pgTable, uuid, unique } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../helpers/timestamps";
import { questions } from "./questions";
import { users } from "./users";

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
    // 1 for upvote/like, -1 for downvote/dislike
    vote: integer("vote").notNull(),
    createdAt,
    updatedAt,
  },
  (table) => ({
    // Composite unique constraint: one vote per user per question
    userQuestionUnique: unique().on(table.userId, table.questionId),
    // Index for fast lookups by questionId (for counting votes)
    questionIdIdx: index("question_votes_question_id_idx").on(table.questionId),
    // Index for fast lookups by userId (for user's vote history)
    userIdIdx: index("question_votes_user_id_idx").on(table.userId),
  }),
);

// Relations
export const questionVotesRelations = relations(questionVotes, ({ one }) => ({
  user: one(users, {
    fields: [questionVotes.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [questionVotes.questionId],
    references: [questions.id],
  }),
}));

export type QuestionVote = InferSelectModel<typeof questionVotes>;
