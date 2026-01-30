import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../helpers/timestamps";
import { questions } from "./questions";
import { users } from "./users"; // Assuming users schema is defined elsewhere

export const answers = pgTable("answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  description: text("description").notNull(), // Answer content, can contain rich text or HTML
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Foreign key to users.id
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});
//Relations
export const answersRelations = relations(answers, ({ one }) => ({
  author: one(users, {
    fields: [answers.authorId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));
export type Answer = InferSelectModel<typeof answers>;
