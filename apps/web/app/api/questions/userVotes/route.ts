import { getUserVotesForQuestions } from "@/data/questionVote";
import { withTryCatch } from "@/lib/utils";
import { type NextRequest } from "next/server";

/**
 * GET /api/questions/userVotes?questionIds=id1,id2,id3
 * Returns user's votes for the specified question IDs
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const questionIdsParam = searchParams.get("questionIds");

  // Parse comma-separated question IDs
  const questionIds = questionIdsParam?.split(",").filter(Boolean) ?? [];

  // Get user votes
  const { result, error } = await withTryCatch(
    getUserVotesForQuestions(questionIds),
  );
  if (result) return Response.json(result);
  else return Response.json(error, { status: 400 });
}
