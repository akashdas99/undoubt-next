"use client";

import { apiRequest, httpMethod } from "@/lib/api/request";
import { questionEndpoints } from "@/lib/domain/endpoints";
import { isEmpty } from "@/lib/functions";
import { enqueueQuestionVote } from "@/lib/questionVoteQueue";
import {
  readCachedUserVote,
  useQuestion,
  useUpdateQuestionCache,
} from "@/lib/queries/questions";
import { useProfile } from "@/lib/queries/user";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface QuestionVoteButtonProps {
  questionId: string;
  likes: number;
  dislikes: number;
  userVote: number | null;
  slug?: string;
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
  slug,
}: QuestionVoteButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { updateQuestion } = useUpdateQuestionCache();
  const { data: user } = useProfile();
  const { data: question } = useQuestion(slug ?? "");
  const currentLikes = question ? question.likes : likes;
  const currentDislikes = question ? question.dislikes : dislikes;
  const currentVote = question ? question.userVote : userVote;

  const handleVote = (newVote: 1 | -1) => {
    if (isEmpty(user)) {
      router.push("/login");
      return;
    }

    const fallbackVote = currentVote;
    enqueueQuestionVote(questionId, async () => {
      const previous =
        readCachedUserVote(queryClient, questionId, slug) ?? fallbackVote;
      const changes = calculateVoteChanges(newVote, previous);
      updateQuestion(questionId, (cached) => ({
        likes: Math.max(0, cached.likes + changes.likesDelta),
        dislikes: Math.max(0, cached.dislikes + changes.dislikesDelta),
        userVote: changes.userVote,
      }));

      const { error } = await apiRequest(questionEndpoints.vote(questionId), {
        method: httpMethod.post,
        body: {
          voteType:
            changes.userVote === null
              ? "remove"
              : newVote === 1
                ? "like"
                : "dislike",
        },
      });

      if (!error) return;

      updateQuestion(questionId, (cached) => ({
        likes: Math.max(0, cached.likes - changes.likesDelta),
        dislikes: Math.max(0, cached.dislikes - changes.dislikesDelta),
        userVote: previous,
      }));
    });
  };

  return (
    <div className="flex items-center gap-sm rounded-full border border-border/60 px-sm py-xxs">
      <VoteButton
        icon={
          <ArrowBigUp
            size={18}
            fill={currentVote === 1 ? "var(--primary)" : "none"}
            stroke={currentVote === 1 ? "var(--primary)" : "currentColor"}
          />
        }
        count={currentLikes}
        onClick={() => handleVote(1)}
        label="Like question"
      />
      <VoteButton
        icon={
          <ArrowBigDown
            size={18}
            fill={currentVote === -1 ? "var(--destructive)" : "none"}
            stroke={currentVote === -1 ? "var(--destructive)" : "currentColor"}
          />
        }
        count={currentDislikes}
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
      className="flex items-center gap-xxs rounded-full text-muted-foreground transition-colors hover:text-foreground"
      aria-label={label}
    >
      {icon}
      <span className="font-semibold">{count}</span>
    </button>
  );
}
