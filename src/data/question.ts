import { QuestionSchema, QuestionType } from "@/validations/question";
import { getProfile } from "./user";
import { errorResponse, successResponse } from "@/lib/response";
import { db } from "@/db/drizzle";
import { questions } from "@/db/schema/questions";
import sanitizeHtml from "sanitize-html";

export async function addQuestion(questionData: QuestionType) {
  //validate question data
  const parsed = QuestionSchema.safeParse({
    ...questionData,
  });
  if (!parsed.success) {
    // Create errors object like React Hook Form expects
    const errors = Object.fromEntries(
      parsed.error.issues.map((issue) => [
        issue.path[0], // assume flat structure with single key path
        { message: issue.message },
      ])
    );
    return errorResponse(errors);
  }
  const validatedQuestion = parsed.data;
  const userSession = await getProfile();

  await db.insert(questions).values({
    title: validatedQuestion?.title,
    description: sanitizeHtml(validatedQuestion?.description || ""),
    authorId: userSession?.id,
    slug: "test",
  });
  return successResponse();
}
