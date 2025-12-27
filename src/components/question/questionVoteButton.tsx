"use client";

import { voteOnQuestionAction } from "@/actions/question";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/lib/store/user/user";
import { isEmpty } from "@/lib/functions";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { selectVoteByQuestionId } from "@/lib/store/questions/question";
import { useAppSelector } from "@/lib/store/hooks";

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
  const { data: user } = useGetProfileQuery();

  // Use initialUserVote directly - it updates from parent when RTK Query fetches new data
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);

  // Access RTK Query cache directly using useAppSelector
  const cachedUserVote = useAppSelector((state) =>
    selectVoteByQuestionId(state, questionId)
  );

  // Determine the current vote state (prefer local optimistic state, then cache, then initial prop)
  const currentVote =
    userVote ??
    (cachedUserVote === 1 ? "like" : cachedUserVote === -1 ? "dislike" : null);

  const handleVote = async (voteType: "like" | "dislike") => {
    // Redirect to login if not authenticated
    if (isEmpty(user)) return router.push("/login");

    // Optimistic update
    if (currentVote === voteType) {
      setUserVote(null); // Remove vote
    } else {
      setUserVote(voteType); // Add or change vote
    }

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
