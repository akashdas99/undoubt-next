import { db } from "@/db/drizzle";
import { questionVotes } from "@/db/schema/questionVotes";
import { questions } from "@/db/schema/questions";
import { errorResponse, successResponse } from "@/lib/response";
import { getSession } from "@/lib/session";
import { and, eq, inArray } from "drizzle-orm";

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
      await db
        .delete(questionVotes)
        .where(
          and(
            eq(questionVotes.questionId, questionId),
            eq(questionVotes.userId, user.id),
          ),
        );
      return successResponse({ message: "Vote removed" });
    }

    const voteValue = voteType === "like" ? 1 : -1;

    // Upsert vote (insert or update if exists)
    // This handles the case where user changes from like to dislike or vice versa
    await db
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
      });

    return successResponse({
      message: `Question ${voteType === "like" ? "liked" : "disliked"}`,
    });
  } catch (error) {
    console.error("Error voting on question:", error);
    return errorResponse("Failed to vote on question");
  }
}

/**
 * Get user's votes for multiple questions in a single query
 * Returns a map of questionId -> vote value (1 for like, -1 for dislike, null for no vote)
 * This is more efficient than calling getQuestionVoteStats for each question
 */
export async function getUserVotesForQuestions(questionIds: string[]) {
  try {
    const user = await getSession();

    // If no user or no questions, return empty map
    if (!user || questionIds.length === 0) {
      return {};
    }
    // Get all user's votes for the provided questions in a single query
    const userVotes = await db
      .select({
        questionId: questionVotes.questionId,
        vote: questionVotes.vote,
      })
      .from(questionVotes)
      .where(
        and(
          eq(questionVotes.userId, user.id),
          inArray(questionVotes.questionId, questionIds),
        ),
      );

    return userVotes.reduce((a, c) => ({ ...a, [c.questionId]: c.vote }), {});
  } catch (error) {
    console.error("Error getting user votes for questions:", error);
    return errorResponse("Failed to get user votes");
  }
}
