import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  profession: z.string().min(2, {
    message: "Profession must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
});

export type UserType = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export type LoginType = z.infer<typeof LoginSchema>;
export type MenuItem = {
  title: string;
  href: string;
  allowedFor: "all" | "loggedInUsers" | "loggedOutUsers";
};
export const QuestionSchema = z.object({
  description: z.string().min(2, {
    message: "Description of the Question is Required!",
  }),
});
export type QuestionType = z.infer<typeof QuestionSchema>;
