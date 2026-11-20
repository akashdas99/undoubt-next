import {
  USER_NAME_MAX_LENGTH,
  USER_USERNAME_MAX_LENGTH,
} from "@workspace/constants";
import { InferSelectModel } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../helpers/timestamps.js";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: USER_NAME_MAX_LENGTH }).notNull(),
  userName: varchar("user_name", { length: USER_USERNAME_MAX_LENGTH }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  profilePicture: varchar("profile_picture", { length: 255 }),
  resetToken: varchar("reset_token", { length: 255 }),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt,
  updatedAt,
});
export type User = Omit<InferSelectModel<typeof users>, "password">;
