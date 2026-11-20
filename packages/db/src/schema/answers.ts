import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../helpers/timestamps.js";
import { questions } from "./questions.js";
import { users } from "./users.js";

export const answers = pgTable("answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  description: text("description").notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export type Answer = InferSelectModel<typeof answers>;