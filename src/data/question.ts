import { db } from "@/db/drizzle";
import { answers } from "@/db/schema/answers";
import { questions } from "@/db/schema/questions";
import { questionVotes } from "@/db/schema/questionVotes";
import { users } from "@/db/schema/users";
import { errorResponse, successResponse } from "@/lib/response";
import createSlug, { parseZodErrors } from "@/lib/utils";
import { withPagination } from "@/lib/withPagination";
import {
  DeleteQuestionSchema,
  DeleteQuestionType,
  EditQuestionSchema,
  EditQuestionType,
  QuestionSchema,
  QuestionType,
} from "@/validations/question";
import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  ilike,
  or,
  sql,
} from "drizzle-orm";
import sanitizeHtml from "sanitize-html";
import { getProfile } from "./user";

export const getQuestions = async (
  keyword: string = "",
  limit: number = 10,
  page: number = 1
) => {
  // Build WHERE conditions for filtering
  const whereConditions = [];
  if (keyword) {
    const keywordCondition = or(
      ilike(questions.title, `%${keyword}%`),
      ilike(questions.description, `%${keyword}%`)
    );
    if (keywordCondition) whereConditions.push(keywordCondition);
  }

  const whereClause =
    whereConditions.length > 0 ? and(...whereConditions) : undefined;

  // Deferred join pattern
  const baseQuery = db
    .select({ id: questions.id })
    .from(questions)
    .where(whereClause)
    .orderBy(desc(questions.updatedAt));

  const [total] = await db
    .select({ count: count() })
    .from(baseQuery.as("subquery"));

  // Use the pagination helper
  const sq = withPagination(baseQuery.$dynamic(), page, limit).as("subquery");
  const data = await db
    .select({
      id: questions.id,
      title: questions.title,
      description: questions.description,
      author: { name: users.name, profilePicture: users.profilePicture },
      authorId: questions.authorId,
      createdAt: questions.createdAt,
      answersCount: countDistinct(answers.id),
      slug: questions.slug,
      likes: sql<number>`COUNT(CASE WHEN ${questionVotes.vote} = 1 THEN 1 END)::int`,
      dislikes: sql<number>`COUNT(CASE WHEN ${questionVotes.vote} = -1 THEN 1 END)::int`,
    })
    .from(questions)
    .innerJoin(sq, eq(questions.id, sq.id))
    .innerJoin(users, eq(questions.authorId, users.id))
    .leftJoin(answers, eq(questions.id, answers.questionId))
    .leftJoin(questionVotes, eq(questions.id, questionVotes.questionId))
    .orderBy(desc(questions.updatedAt))
    .groupBy(questions.id, users.id);
  return {
    data,
    pagination: {
      page,
      totalPages: Math.ceil(total.count / limit),
    },
  };
};

export const getAllQuestions = async () => {
  const result = await db
    .select({
      id: questions.id,
      slug: questions.slug,
    })
    .from(questions)
    .orderBy(desc(questions?.updatedAt));
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

  await db.insert(questions).values({
    title: validatedQuestion?.title,
    description: sanitizeHtml(validatedQuestion?.description || ""),
    authorId: userSession?.id,
    slug: createSlug(validatedQuestion.title),
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
      authorId: questions.authorId,
      createdAt: questions.createdAt,
      answersCount: countDistinct(answers.id),
      slug: questions.slug,
      likes: sql<number>`COUNT(CASE WHEN ${questionVotes.vote} = 1 THEN 1 END)::int`,
      dislikes: sql<number>`COUNT(CASE WHEN ${questionVotes.vote} = -1 THEN 1 END)::int`,
    })
    .from(questions)
    .innerJoin(
      users,
      and(eq(questions.slug, slug), eq(questions.authorId, users.id))
    )
    .leftJoin(answers, eq(answers.questionId, questions.id))
    .leftJoin(questionVotes, eq(questions.id, questionVotes.questionId))
    .groupBy(questions.id, users.id)
    .limit(1)
    .orderBy(desc(questions?.updatedAt));

  return question;
}

export async function editQuestion(questionData: EditQuestionType) {
  // Validate question data
  const parsed = EditQuestionSchema.safeParse(questionData);
  if (!parsed.success) {
    return errorResponse(parseZodErrors(parsed.error));
  }

  const validatedQuestion = parsed.data;
  const userSession = await getProfile();

  // Check if question exists and belongs to user
  const [existingQuestion] = await db
    .select({ authorId: questions.authorId })
    .from(questions)
    .where(eq(questions.id, validatedQuestion.id))
    .limit(1);

  if (!existingQuestion) {
    return errorResponse("Question not found");
  }

  if (existingQuestion.authorId !== userSession?.id) {
    return errorResponse("You don't have permission to edit this question");
  }

  // Update question (don't update slug to avoid breaking existing links)
  await db
    .update(questions)
    .set({
      title: validatedQuestion.title,
      description: sanitizeHtml(validatedQuestion.description || ""),
    })
    .where(eq(questions.id, validatedQuestion.id));

  return successResponse({ message: "Question updated successfully" });
}

export async function deleteQuestion(questionData: DeleteQuestionType) {
  // Validate question data
  const parsed = DeleteQuestionSchema.safeParse(questionData);
  if (!parsed.success) {
    return errorResponse(parseZodErrors(parsed.error));
  }

  const validatedQuestion = parsed.data;
  const userSession = await getProfile();

  // Check if question exists and belongs to user
  const [existingQuestion] = await db
    .select({ authorId: questions.authorId, slug: questions.slug })
    .from(questions)
    .where(eq(questions.id, validatedQuestion.id))
    .limit(1);

  if (!existingQuestion) {
    return errorResponse("Question not found");
  }

  if (existingQuestion.authorId !== userSession?.id) {
    return errorResponse("You don't have permission to delete this question");
  }

  // Delete question (answers will cascade delete due to schema)
  await db.delete(questions).where(eq(questions.id, validatedQuestion.id));

  return successResponse({
    message: "Question deleted successfully",
    slug: existingQuestion.slug,
  });
}
