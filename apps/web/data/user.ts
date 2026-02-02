import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema/users";
import { questions } from "@/db/schema/questions";
import { answers } from "@/db/schema/answers";
import { getSession } from "@/lib/session";

export async function getUserById(userId: string) {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      userName: users.userName,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      profilePicture: users.profilePicture,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new Error("User not available");
  }

  return user;
}

export async function getProfile() {
  const session = await getSession();
  if (!session?.id) {
    throw new Error("Session not found");
  }

  return getUserById(session.id);
}

export async function getTopContributors(limit: number = 10) {
  const questionCounts = db
    .select({
      authorId: questions.authorId,
      questionCount: sql<number>`CAST(COUNT(*) AS INTEGER)`.as("questionCount"),
    })
    .from(questions)
    .groupBy(questions.authorId)
    .as("qc");

  const answerCounts = db
    .select({
      authorId: answers.authorId,
      answerCount: sql<number>`CAST(COUNT(*) AS INTEGER)`.as("answerCount"),
    })
    .from(answers)
    .groupBy(answers.authorId)
    .as("ac");

  const result = await db
    .select({
      id: users.id,
      name: users.name,
      userName: users.userName,
      profilePicture: users.profilePicture,
      createdAt: users.createdAt,
      questionCount:
        sql<number>`COALESCE(${questionCounts.questionCount}, 0)`.as(
          "questionCount",
        ),
      answerCount: sql<number>`COALESCE(${answerCounts.answerCount}, 0)`.as(
        "answerCount",
      ),
    })
    .from(users)
    .leftJoin(questionCounts, eq(questionCounts.authorId, users.id))
    .leftJoin(answerCounts, eq(answerCounts.authorId, users.id))
    .where(
      sql`COALESCE(${questionCounts.questionCount}, 0) + COALESCE(${answerCounts.answerCount}, 0) > 0`,
    )
    .orderBy(
      desc(
        sql`COALESCE(${questionCounts.questionCount}, 0) + COALESCE(${answerCounts.answerCount}, 0)`,
      ),
    )
    .limit(limit);

  return result;
}
