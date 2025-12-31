"use client";

import { voteOnQuestionAction } from "@/actions/question";
import { isEmpty } from "@/lib/functions";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  questionApi,
  selectVoteByQuestionId,
  selectQuestionById,
} from "@/lib/store/questions/question";
import { useGetProfileQuery } from "@/lib/store/user/user";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuestionVoteButtonProps {
  questionId: string;
}

type VoteType = "like" | "dislike";

export default function QuestionVoteButton({
  questionId,
}: QuestionVoteButtonProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: user } = useGetProfileQuery();

  // Get current user's vote from cache using memoized selector
  const cachedUserVote = useAppSelector((state) =>
    selectVoteByQuestionId(state, questionId)
  );

  // Get cached like/dislike counts from getQuestions cache using memoized selector
  const cachedQuestion = useAppSelector((state) =>
    selectQuestionById(state, questionId)
  );

  // Derive current vote state and counts
  const currentVote: VoteType | null =
    cachedUserVote === 1 ? "like" : cachedUserVote === -1 ? "dislike" : null;

  // Update user votes cache optimistically
  const updateUserVotesCache = (newVoteValue: number | null) => {
    dispatch((dispatch, getState) => {
      const state = getState();
      const allQueries = state.getQuestions.queries;

      Object.values(allQueries).forEach((value) => {
        if (
          value?.endpointName === "getUserVotes" &&
          value.status === "fulfilled"
        ) {
          const questionIds = value.originalArgs as string[] | undefined;
          if (questionIds?.includes(questionId)) {
            dispatch(
              questionApi.util.updateQueryData(
                "getUserVotes",
                questionIds,
                (draft) => {
                  draft[questionId] = newVoteValue;
                }
              )
            );
          }
        }
      });
    });
  };

  // Update questions cache optimistically
  const updateQuestionsCache = (voteType: VoteType) => {
    dispatch(
      questionApi.util.updateQueryData("getQuestions", "", (draft) => {
        draft.pages.forEach((page) => {
          const question = page.data?.find((q) => q.id === questionId);
          if (!question) return;

          // Removing current vote
          if (voteType === currentVote) {
            if (currentVote === "like") {
              question.likes = Math.max(0, question.likes - 1);
            } else {
              question.dislikes = Math.max(0, question.dislikes - 1);
            }
          }
          // Adding or changing vote
          else {
            if (voteType === "like") {
              question.likes += 1;
              if (currentVote === "dislike") {
                question.dislikes = Math.max(0, question.dislikes - 1);
              }
            } else {
              question.dislikes += 1;
              if (currentVote === "like") {
                question.likes = Math.max(0, question.likes - 1);
              }
            }
          }
        });
      })
    );
  };

  const handleVote = async (voteType: VoteType) => {
    if (isEmpty(user)) return router.push("/login");

    const isRemoving = currentVote === voteType;
    const newVoteValue = isRemoving ? null : voteType === "like" ? 1 : -1;

    // Optimistically update both caches
    updateUserVotesCache(newVoteValue);
    updateQuestionsCache(voteType);

    // Perform server action
    await voteOnQuestionAction(questionId, isRemoving ? "remove" : voteType);
  };

  return (
    <div className="flex items-center gap-2">
      <VoteButton
        icon={<ThumbsUp size={16} />}
        count={cachedQuestion?.likes || 0}
        isActive={currentVote === "like"}
        onClick={() => handleVote("like")}
        activeClass="bg-accent text-accent-foreground"
        label="Like question"
      />
      <VoteButton
        icon={<ThumbsDown size={16} />}
        count={cachedQuestion?.dislikes || 0}
        isActive={currentVote === "dislike"}
        onClick={() => handleVote("dislike")}
        activeClass="bg-destructive text-destructive-foreground"
        label="Dislike question"
      />
    </div>
  );
}

// Extracted vote button component for reusability
function VoteButton({
  icon,
  count,
  isActive,
  onClick,
  activeClass,
  label,
}: {
  icon: React.ReactNode;
  count: number;
  isActive: boolean;
  onClick: () => void;
  activeClass: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
        isActive ? activeClass : "bg-secondary hover:bg-secondary/80"
      }`}
      aria-label={label}
    >
      {icon}
      <span className="font-semibold">{count}</span>
    </button>
  );
}
