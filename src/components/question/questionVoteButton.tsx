"use client";

import { voteOnQuestionAction } from "@/actions/question";
import { isEmpty } from "@/lib/functions";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  questionApi,
  selectVoteByQuestionId,
} from "@/lib/store/questions/question";
import { useGetProfileQuery } from "@/lib/store/user/user";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuestionVoteButtonProps {
  questionId: string;
  initialLikes: number;
  initialDislikes: number;
}

export default function QuestionVoteButton({
  questionId,
  initialLikes,
  initialDislikes,
}: QuestionVoteButtonProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: user } = useGetProfileQuery();
  // Access RTK Query cache directly using useAppSelector
  const cachedUserVote = useAppSelector((state) =>
    selectVoteByQuestionId(state, questionId)
  );

  // Get all queries to find getUserVotes cache entries
  const allQueries = useAppSelector((state) => state.getQuestions.queries);

  // Determine the current vote state (prefer local optimistic state, then cache, then initial prop)
  const currentVote =
    cachedUserVote === 1 ? "like" : cachedUserVote === -1 ? "dislike" : null;

  const handleVote = async (voteType: "like" | "dislike") => {
    // Redirect to login if not authenticated
    if (isEmpty(user)) return router.push("/login");

    const newVote = currentVote === voteType ? null : voteType;
    const newVoteValue =
      newVote === "like" ? 1 : newVote === "dislike" ? -1 : null;

    // Update RTK Query cache optimistically
    // Find and update all getUserVotes cache entries that contain this questionId
    Object.values(allQueries).forEach((value) => {
      if (
        value?.endpointName === "getUserVotes" &&
        value.status === "fulfilled"
      ) {
        // Extract the original args (array of questionIds) from the query
        const questionIds = value.originalArgs as string[] | undefined;

        // If this cache entry includes our questionId, update it
        if (questionIds?.includes(questionId)) {
          dispatch(
            questionApi.util.updateQueryData(
              "getUserVotes",
              questionIds,
              (draft) => {
                // Update the vote in the cache
                draft[questionId] = newVoteValue;
              }
            )
          );
        }
      }
    });

    // Perform server action
    await voteOnQuestionAction(
      questionId,
      currentVote === voteType ? "remove" : voteType
    );
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote("like")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
          currentVote === "like"
            ? "bg-accent text-accent-foreground"
            : "bg-secondary hover:bg-secondary/80"
        } `}
        aria-label="Like question"
      >
        <ThumbsUp size={16} />
        <span className="font-semibold">{initialLikes}</span>
      </button>

      <button
        onClick={() => handleVote("dislike")}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
          currentVote === "dislike"
            ? "bg-destructive text-destructive-foreground"
            : "bg-secondary hover:bg-secondary/80"
        } `}
        aria-label="Dislike question"
      >
        <ThumbsDown size={16} />
        <span className="font-semibold">{initialDislikes}</span>
      </button>
    </div>
  );
}
