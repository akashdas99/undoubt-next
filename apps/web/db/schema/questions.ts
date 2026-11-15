import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../helpers/timestamps";
import { users } from "./users";

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(), // To contain HTML from rich text editor
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt,
  updatedAt,
});
