import { parseZodErrors } from "@/lib/utils";
import { getProfile } from "./user";

import { AnswerSchema, AnswerType } from "@/validations/answer";
import { errorResponse } from "@/lib/response";
import { db } from "@/db/drizzle";
import { answers } from "@/db/schema/answers";
import sanitizeHtml from "sanitize-html";
import { successResponse } from "@/lib/response";
import { questions } from "@/db/schema/questions";
import { eq } from "drizzle-orm";

export async function addAnswer(slug: string, answerData: AnswerType) {
  //validate answer
  const parsed = AnswerSchema.safeParse({
    ...answerData,
  });
  if (!parsed?.success) {
    return errorResponse(parseZodErrors(parsed.error));
  }
  const userSession = await getProfile();
  const [question] = await db
    .select({ id: questions.id })
    .from(questions)
    .where(eq(questions.slug, slug));

  if (!question?.id) {
    return errorResponse({
      root: { message: "Question not found" },
    });
  }
  await db.insert(answers).values({
    description: sanitizeHtml(parsed?.data?.description || ""),
    authorId: userSession?.id,
    questionId: question?.id,
  });
  return successResponse();
}
