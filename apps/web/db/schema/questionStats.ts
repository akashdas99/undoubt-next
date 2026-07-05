import { InferSelectModel, relations } from "drizzle-orm";
import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { questions } from "./questions";

export const questionStats = pgTable("question_stats", {
  questionId: uuid("question_id")
    .primaryKey()
    .references(() => questions.id, { onDelete: "cascade" }),
  likes: integer("likes").notNull().default(0),
  dislikes: integer("dislikes").notNull().default(0),
  answersCount: integer("answers_count").notNull().default(0),
});

export const questionStatsRelations = relations(questionStats, ({ one }) => ({
  question: one(questions, {
    fields: [questionStats.questionId],
    references: [questions.id],
  }),
}));

export type QuestionStats = InferSelectModel<typeof questionStats>;
