import { z } from "zod";

export const QuestionSchema = z.object({
  title: z.string().min(10, {
    message: "Title of the Question cannot be less than 10 characters",
  }),
  description: z.string().optional(),
});
export type QuestionType = z.infer<typeof QuestionSchema>;
