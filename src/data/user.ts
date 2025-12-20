import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema/users";
import { questions } from "@/db/schema/questions";
import { answers } from "@/db/schema/answers";
import { getSession } from "@/lib/session";

export async function getProfile() {
  const session = await getSession();
  if (!session?.id) {
    throw new Error("Session not found");
  }

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
    .where(eq(users.id, session.id))
    .limit(1);

  if (!user) {
    throw new Error("User not available");
  }

  return user;
}

export async function getTopContributors(limit: number = 10) {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      userName: users.userName,
      profilePicture: users.profilePicture,
      createdAt: users.createdAt,
      questionCount:
        sql<number>`CAST(COUNT(DISTINCT ${questions.id}) AS INTEGER)`.as(
          "questionCount"
        ),
      answerCount:
        sql<number>`CAST(COUNT(DISTINCT ${answers.id}) AS INTEGER)`.as(
          "answerCount"
        ),
    })
    .from(users)
    .leftJoin(questions, eq(questions.authorId, users.id))
    .leftJoin(answers, eq(answers.authorId, users.id))
    .groupBy(users.id)
    .orderBy(
      desc(sql`COUNT(DISTINCT ${questions.id}) + COUNT(DISTINCT ${answers.id})`)
    )
    .limit(limit);

  return result;
}
