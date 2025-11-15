import { parseZodErrors } from "@/lib/utils";

import { db } from "@/db/drizzle";
import { answers } from "@/db/schema/answers";
import { questions } from "@/db/schema/questions";
import { errorResponse, successResponse } from "@/lib/response";
import { getSession } from "@/lib/session";
import { AnswerSchema, AnswerType } from "@/validations/answer";
import { desc, eq } from "drizzle-orm";
import sanitizeHtml from "sanitize-html";
import { users } from "@/db/schema/users";

export async function addAnswer(slug: string, answerData: AnswerType) {
  //validate answer
  const parsed = AnswerSchema.safeParse({
    ...answerData,
  });
  if (!parsed?.success) {
    return errorResponse(parseZodErrors(parsed.error));
  }
  const userSession = await getSession();
  if (!userSession) return errorResponse("Unauthorized");

  const [question] = await db
    .select({ id: questions.id })
    .from(questions)
    .where(eq(questions.slug, slug));

  if (!question?.id) {
    return errorResponse("Question not found");
  }
  await db.insert(answers).values({
    description: sanitizeHtml(parsed?.data?.description || ""),
    authorId: userSession?.id,
    questionId: question?.id,
  });
  return successResponse();
}
export async function updateAnswer(id: string, answerData: AnswerType) {
  //validate answer
  const parsed = AnswerSchema.safeParse({
    ...answerData,
  });
  if (!parsed?.success) {
    return errorResponse(parseZodErrors(parsed.error));
  }

  // Get current user session for authorization check
  const userSession = await getSession();
  if (!userSession) return errorResponse("Unauthorized");

  // Fetch answer to verify it exists and check ownership
  const [answer] = await db
    .select({ id: answers?.id, authorId: answers?.authorId })
    .from(answers)
    .where(eq(answers?.id, id));

  if (!answer) {
    return errorResponse("Answer not found");
  }
  // Verify that the current user is the author of the answer
  if (answer?.authorId !== userSession?.id) {
    return errorResponse("Not authorized to update this answer");
  }
  await db
    .update(answers)
    .set({
      description: sanitizeHtml(parsed?.data?.description),
    })
    .where(eq(answers.id, id));
  return successResponse();
}

export async function deleteAnswer(id: string) {
  const userSession = await getSession();
  if (!userSession) return errorResponse("Unauthorized");

  const [answer] = await db
    .select({ id: answers?.id, authorId: answers?.authorId })
    .from(answers)
    .where(eq(answers?.id, id));
  if (!answer) {
    return errorResponse("Answer not found");
  }
  // Verify that the current user is the author of the answer
  if (answer?.authorId !== userSession?.id) {
    return errorResponse("Not authorized to delete this answer");
  }
  await db.delete(answers).where(eq(answers?.id, id));
  return successResponse();
}
/**
 * Gets all answers for a question by its slug
 * @param slug - The slug of the question
 * @param limit - Maximum number of answers to return (default: 50)
 * @param page - Page number for pagination (default: 1)
 * @returns Array of answers with author information, sorted by updatedAt descending
 */
export async function getAnswersByQuestionSlug(
  slug: string,
  limit: number = 50,
  page: number = 1
) {
  const offset = limit * (page - 1);
  const answerList = await db
    .select({
      id: answers.id,
      description: answers.description,
      authorId: answers.authorId,
      questionId: answers.questionId,
      createdAt: answers.createdAt,
      updatedAt: answers.updatedAt,
      author: {
        name: users.name,
        profilePicture: users.profilePicture,
      },
    })
    .from(answers)
    .innerJoin(questions, eq(answers.questionId, questions.id))
    .innerJoin(users, eq(answers.authorId, users.id))
    .where(eq(questions.slug, slug))
    .orderBy(desc(answers.updatedAt))
    .limit(limit)
    .offset(offset);
  return successResponse(answerList);
}
