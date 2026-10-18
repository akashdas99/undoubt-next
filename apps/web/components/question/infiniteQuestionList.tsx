"use client";

import { INTERSECTION_THRESHOLD } from "@/lib/constants";
import { useQuestionsInfinite } from "@/lib/queries/questions";
import { useEffect, useRef } from "react";
import QuestionCard from "./questionCard";
import QuestionDeleteModal from "./questionDeleteModal";

interface InfiniteQuestionListProps {
  userId?: string | null;
}

export default function InfiniteQuestionList({
  userId,
}: InfiniteQuestionListProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
    useQuestionsInfinite("", userId);

  const questions = data?.pages?.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { threshold: INTERSECTION_THRESHOLD }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetching, fetchNextPage]);

  if (questions.length === 0 && !isLoading) {
    return <p>No Questions</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-lg">
        {questions.map((question) => (
          <QuestionCard key={question?.id} question={question} />
        ))}
      </div>

      {hasNextPage && (
        <div ref={observerRef} className="py-2xl text-center">
          {isFetching ? (
            <div className="flex items-center justify-center gap-xs">
              <div className="size-xl animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              <span>Loading more questions...</span>
            </div>
          ) : (
            <div className="h-2xl" />
          )}
        </div>
      )}

      {!hasNextPage && questions.length > 0 && (
        <div className="py-2xl text-center text-muted-foreground">
          No more questions to load
        </div>
      )}

      <QuestionDeleteModal />
    </>
  );
}
