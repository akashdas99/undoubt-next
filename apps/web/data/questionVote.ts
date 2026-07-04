import { db } from "@/db/drizzle";
import { questionVotes } from "@/db/schema/questionVotes";
import { questionStats } from "@/db/schema/questionStats";
import { questions } from "@/db/schema/questions";
import { errorResponse, successResponse } from "@/lib/response";
import { getSession } from "@/lib/session";
import { and, eq, sql } from "drizzle-orm";

const recomputeStats = (questionId: string) =>
  db
    .update(questionStats)
    .set({
      likes: sql`(SELECT COUNT(*) FROM ${questionVotes} WHERE ${questionVotes.questionId} = ${questionId} AND ${questionVotes.vote} = 1)`,
      dislikes: sql`(SELECT COUNT(*) FROM ${questionVotes} WHERE ${questionVotes.questionId} = ${questionId} AND ${questionVotes.vote} = -1)`,
    })
    .where(eq(questionStats.questionId, questionId));

export type VoteType = "like" | "dislike" | "remove";

/**
 * Toggle vote on a question (like/dislike/remove)
 * This is scalable because:
 * 1. Uses composite unique constraint to prevent duplicate votes
 * 2. Single atomic operation (INSERT ... ON CONFLICT)
 * 3. No race conditions
 * 4. Indexed foreign keys for fast queries
 */
export async function voteOnQuestion(questionId: string, voteType: VoteType) {
  try {
    const user = await getSession();
    if (!user) {
      return errorResponse("You must be logged in to vote");
    }

    // Check if question exists
    const [question] = await db
      .select({ id: questions.id })
      .from(questions)
      .where(eq(questions.id, questionId))
      .limit(1);

    if (!question) {
      return errorResponse("Question not found");
    }

    // Handle vote removal
    if (voteType === "remove") {
      await db.batch([
        db
          .delete(questionVotes)
          .where(
            and(
              eq(questionVotes.questionId, questionId),
              eq(questionVotes.userId, user.id),
            ),
          ),
        recomputeStats(questionId),
      ]);
      return successResponse({ message: "Vote removed" });
    }

    const voteValue = voteType === "like" ? 1 : -1;

    // Upsert vote (insert or update if exists)
    // This handles the case where user changes from like to dislike or vice versa
    await db.batch([
      db
        .insert(questionVotes)
        .values({
          questionId,
          userId: user.id,
          vote: voteValue,
        })
        .onConflictDoUpdate({
          target: [questionVotes.userId, questionVotes.questionId],
          set: {
            vote: voteValue,
          },
        }),
      recomputeStats(questionId),
    ]);

    return successResponse({
      message: `Question ${voteType === "like" ? "liked" : "disliked"}`,
    });
  } catch (error) {
    console.error("Error voting on question:", error);
    return errorResponse("Failed to vote on question");
  }
}
