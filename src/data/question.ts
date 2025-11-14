import { db } from "@/db/drizzle";
import { questions } from "@/db/schema/questions";
import { errorResponse, successResponse } from "@/lib/response";
import { parseZodErrors } from "@/lib/utils";
import { QuestionSchema, QuestionType } from "@/validations/question";
import { nanoid } from "@reduxjs/toolkit";
import sanitizeHtml from "sanitize-html";
import slugify from "slugify";
import { getProfile } from "./user";
import { and, count, desc, eq, like } from "drizzle-orm";
import { users } from "@/db/schema/users";
import { answers } from "@/db/schema/answers";

export const getQuestions = async (
  keyword: string = "",
  limit: number = 10,
  page: number = 1
) => {
  const offset = limit * (page - 1);

  const result = await db
    .select({
      id: questions.id,
      title: questions.title,
      description: questions.description,
      author: { name: users.name, profilePicture: users.profilePicture },
      createdAt: questions.createdAt,
      answersCount: count(answers.id),
      slug: questions.slug,
    })
    .from(questions)
    .innerJoin(
      users,
      and(
        like(questions.description, `%${keyword}%`),
        eq(questions.authorId, users.id)
      )
    )
    .leftJoin(answers, eq(questions.id, answers.questionId))
    .groupBy(questions.id, users.id)
    .orderBy(desc(questions?.updatedAt))
    .limit(limit)
    .offset(offset);
  return result;
};
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
export async function getQuestionBySlug(slug: string) {
  const [question] = await db
    .select({
      id: questions.id,
      title: questions.title,
      description: questions.description,
      author: { name: users.name, profilePicture: users.profilePicture },
      createdAt: questions.createdAt,
      answersCount: count(answers.id).as("answerCount"),
    })
    .from(questions)
    .innerJoin(
      users,
      and(eq(questions.slug, slug), eq(questions.authorId, users.id))
    )
    .leftJoin(answers, eq(answers.questionId, questions.id))
    .groupBy(questions.id, users.id)
    .limit(1)
    .orderBy(desc(questions?.updatedAt));

  return question;
}
