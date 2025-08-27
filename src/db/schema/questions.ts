import { relations } from "drizzle-orm";
import { pgTable, serial, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../helpers/timestamps";
import { users } from "./users"; // Assume users schema is defined elsewhere
import { answers } from "./answers"; // Assume answers schema is defined in answers.ts

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(), // To contain HTML from rich text editor
  authorId: serial("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt,
  updatedAt,
});

// Relations

export const questionsRelations = relations(questions, ({ one, many }) => ({
  author: one(users, {
    fields: [questions.authorId],
    references: [users.id],
  }),
  answers: many(answers), // One question has many answers
}));
