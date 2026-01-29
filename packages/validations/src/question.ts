import { z } from "zod";

export const QuestionSchema = z.object({
  title: z.string().min(10, {
    message: "Title of the Question cannot be less than 10 characters",
  }),
  description: z.string().optional(),
});
export type QuestionType = z.infer<typeof QuestionSchema>;

export const EditQuestionSchema = z.object({
  id: z.string().uuid({
    message: "Invalid question ID",
  }),
  title: z.string().min(10, {
    message: "Title of the Question cannot be less than 10 characters",
  }),
  description: z.string().optional(),
});
export type EditQuestionType = z.infer<typeof EditQuestionSchema>;

export const DeleteQuestionSchema = z.object({
  id: z.string().uuid({
    message: "Invalid question ID",
  }),
});
export type DeleteQuestionType = z.infer<typeof DeleteQuestionSchema>;
