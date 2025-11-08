import { db } from "@/db/drizzle";
import { questions } from "@/db/schema/questions";
import { errorResponse, successResponse } from "@/lib/response";
import { parseZodErrors } from "@/lib/utils";
import { QuestionSchema, QuestionType } from "@/validations/question";
import { nanoid } from "@reduxjs/toolkit";
import sanitizeHtml from "sanitize-html";
import slugify from "slugify";
import { getProfile } from "./user";

export async function addQuestion(questionData: QuestionType) {
  //validate question data
  const parsed = QuestionSchema.safeParse({
    ...questionData,
  });
  if (!parsed.success) {
    // Create errors object like React Hook Form expects
    return errorResponse(parseZodErrors(parsed.error));
  }
  const validatedQuestion = parsed.data;
  const userSession = await getProfile();

  // Generate slug from title and append short UUID for uniqueness
  const baseSlug = slugify(validatedQuestion.title, {
    lower: true,
    strict: true,
    trim: true,
  });
  const uniqueId = nanoid(8);
  const slug = `${baseSlug}-${uniqueId}`;

  await db.insert(questions).values({
    title: validatedQuestion?.title,
    description: sanitizeHtml(validatedQuestion?.description || ""),
    authorId: userSession?.id,
    slug: slug,
  });
  return successResponse();
}
