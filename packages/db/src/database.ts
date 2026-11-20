import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { answers } from "./schema/answers.js";
import { questionStats } from "./schema/questionStats.js";
import { questionVotes } from "./schema/questionVotes.js";
import { questions } from "./schema/questions.js";
import { users } from "./schema/users.js";

export const schema = {
  answers,
  questions,
  questionStats,
  questionVotes,
  users,
};

export type Database = NodePgDatabase;