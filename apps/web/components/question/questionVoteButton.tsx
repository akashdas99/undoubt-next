"use client";

import { voteOnQuestionAction } from "@/actions/question";
import { isEmpty } from "@/lib/functions";
import { useProfile } from "@/lib/queries/user";
import {
  useVoteByQuestionId,
  useQuestionById,
  type PaginatedResponse,
} from "@/lib/queries/questions";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface QuestionVoteButtonProps {
  questionId: string;
}

type VoteType = "like" | "dislike";

export default function QuestionVoteButton({
  questionId,
}: QuestionVoteButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useProfile();

  // Get current user's vote from cache
  const cachedUserVote = useVoteByQuestionId(questionId);

  // Get cached like/dislike counts from getQuestions cache
  const cachedQuestion = useQuestionById(questionId);

  // Derive current vote state and counts
  const currentVote: VoteType | null =
    cachedUserVote === 1 ? "like" : cachedUserVote === -1 ? "dislike" : null;

  // Update user votes cache optimistically
  const updateUserVotesCache = (newVoteValue: number | null) => {
    const allQueries = queryClient.getQueriesData<
      Record<string, number | null>
    >({
      queryKey: ["userVotes"],
    });

    for (const [queryKey, data] of allQueries) {
      if (data?.[questionId] !== undefined) {
        queryClient.setQueryData(queryKey, {
          ...data,
          [questionId]: newVoteValue,
        });
      }
    }
  };

  // Update questions cache optimistically
  const updateQuestionsCache = (voteType: VoteType) => {
    queryClient.setQueriesData<{
      pages: PaginatedResponse[];
      pageParams: number[];
    }>({ queryKey: ["questions", "list"] }, (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data?.map((question) => {
            if (question.id !== questionId) return question;

            const newQuestion = { ...question };

            // Removing current vote
            if (voteType === currentVote) {
              if (currentVote === "like") {
                newQuestion.likes = Math.max(0, question.likes - 1);
              } else {
                newQuestion.dislikes = Math.max(0, question.dislikes - 1);
              }
            }
            // Adding or changing vote
            else {
              if (voteType === "like") {
                newQuestion.likes = question.likes + 1;
                if (currentVote === "dislike") {
                  newQuestion.dislikes = Math.max(0, question.dislikes - 1);
                }
              } else {
                newQuestion.dislikes = question.dislikes + 1;
                if (currentVote === "like") {
                  newQuestion.likes = Math.max(0, question.likes - 1);
                }
              }
            }

            return newQuestion;
          }),
        })),
      };
    });
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
        icon={
          <ArrowBigUp
            size={18}
            fill={currentVote === "like" ? "var(--primary)" : "none"}
            stroke={currentVote === "like" ? "var(--primary)" : "currentColor"}
          />
        }
        count={cachedQuestion?.likes || 0}
        onClick={() => handleVote("like")}
        label="Like question"
      />
      <VoteButton
        icon={
          <ArrowBigDown
            size={18}
            fill={currentVote === "dislike" ? "var(--destructive)" : "none"}
            stroke={
              currentVote === "dislike" ? "var(--destructive)" : "currentColor"
            }
          />
        }
        count={cachedQuestion?.dislikes || 0}
        onClick={() => handleVote("dislike")}
        label="Dislike question"
      />
    </div>
  );
}

// Extracted vote button component for reusability
function VoteButton({
  icon,
  count,
  onClick,
  label,
}: {
  icon: React.ReactNode;
  count: number;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center text-muted-foreground hover:underline gap-1 rounded-lg`}
      aria-label={label}
    >
      {icon}
      <span className="font-semibold">{count}</span>
    </button>
  );
}
