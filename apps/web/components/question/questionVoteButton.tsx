"use client";

import { voteOnQuestionAction } from "@/actions/question";
import { isEmpty } from "@/lib/functions";
import { useProfile } from "@/lib/queries/user";
import { type PaginatedResponse } from "@/lib/queries/questions";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface QuestionVoteButtonProps {
  questionId: string;
  likes: number;
  dislikes: number;
  userVote: number | null;
}

function calculateVoteChanges(newVote: 1 | -1, currentVote: number | null) {
  const isRemoving = newVote === currentVote;
  const isAddingLike = newVote === 1 && !isRemoving;
  const isAddingDislike = newVote === -1 && !isRemoving;
  const hadLike = currentVote === 1;
  const hadDislike = currentVote === -1;

  return {
    userVote: isRemoving ? null : newVote,
    likesDelta: Number(isAddingLike) - Number(hadLike),
    dislikesDelta: Number(isAddingDislike) - Number(hadDislike),
  };
}

export default function QuestionVoteButton({
  questionId,
  likes,
  dislikes,
  userVote,
}: QuestionVoteButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useProfile();

  const updateQuestionsCache = (newVote: 1 | -1) => {
    const changes = calculateVoteChanges(newVote, userVote);

    queryClient.setQueriesData<{
      pages: PaginatedResponse[];
      pageParams: number[];
    }>({ queryKey: ["questions", "list"] }, (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data?.map((question) =>
            question.id === questionId
              ? {
                  ...question,
                  likes: Math.max(0, question.likes + changes.likesDelta),
                  dislikes: Math.max(
                    0,
                    question.dislikes + changes.dislikesDelta,
                  ),
                  userVote: changes.userVote,
                }
              : question,
          ),
        })),
      };
    });
  };

  const handleVote = async (newVote: 1 | -1) => {
    if (isEmpty(user)) return router.push("/login");

    const isRemoving = userVote === newVote;

    updateQuestionsCache(newVote);

    await voteOnQuestionAction(
      questionId,
      isRemoving ? "remove" : newVote === 1 ? "like" : "dislike",
    );
  };

  return (
    <div className="flex items-center gap-2">
      <VoteButton
        icon={
          <ArrowBigUp
            size={18}
            fill={userVote === 1 ? "var(--primary)" : "none"}
            stroke={userVote === 1 ? "var(--primary)" : "currentColor"}
          />
        }
        count={likes}
        onClick={() => handleVote(1)}
        label="Like question"
      />
      <VoteButton
        icon={
          <ArrowBigDown
            size={18}
            fill={userVote === -1 ? "var(--destructive)" : "none"}
            stroke={userVote === -1 ? "var(--destructive)" : "currentColor"}
          />
        }
        count={dislikes}
        onClick={() => handleVote(-1)}
        label="Dislike question"
      />
    </div>
  );
}

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
