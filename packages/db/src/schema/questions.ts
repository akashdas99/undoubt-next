import { QUESTION_TITLE_MAX_LENGTH } from "@workspace/constants";
import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../helpers/timestamps.js";
import { users } from "./users.js";

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: QUESTION_TITLE_MAX_LENGTH }).notNull(),
  description: text("description").notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt,
  updatedAt,
});