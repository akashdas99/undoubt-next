import { z } from "zod";

export const AnswerSchema = z.object({
  description: z.string().min(10, {
    message: "Answer cannot be less than 10 characters",
  }),
});
export type AnswerType = z.infer<typeof AnswerSchema>;
