"use client";

import { INTERSECTION_THRESHOLD } from "@/lib/constants";
import { useAnswersInfinite, type AnswerListItem } from "@/lib/queries/answers";
import { Button } from "@workspace/ui/components/button";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import AnswerCard from "./answerCard";

function toAnswerCard(answer: AnswerListItem) {
  return {
    ...answer,
    createdAt: new Date(answer.createdAt),
    updatedAt: new Date(answer.updatedAt),
  };
}

export default function AnswerListPages({ slug }: { slug: string }) {
  const observerRef = useRef<HTMLDivElement>(null);
  const {
    data,
    isLoading,
    isFetching,
    isError,
    isFetchNextPageError,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useAnswersInfinite(slug);

  const answers = data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasNextPage &&
          !isFetching &&
          !isFetchNextPageError
        ) {
          fetchNextPage();
        }
      },
      { threshold: INTERSECTION_THRESHOLD }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetching, isFetchNextPageError, fetchNextPage]);

  if (answers.length === 0 && !isLoading) {
    if (isError) {
      return (
        <div className="flex flex-col items-start gap-sm">
          <p>Could not load answers</p>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      );
    }
    return <p>No Answer</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-md">
        {answers.map((answer) => (
          <AnswerCard key={answer.id} answer={toAnswerCard(answer)} />
        ))}
      </div>
      {hasNextPage ? (
        <div ref={observerRef} className="py-2xl text-center">
          {isFetching ? (
            <div className="flex items-center justify-center gap-xs">
              <Loader2 className="animate-spin" />
              <span>Loading more answers...</span>
            </div>
          ) : isFetchNextPageError ? (
            <div className="flex flex-col items-center gap-sm">
              <p>Could not load more answers</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fetchNextPage()}
              >
                Try again
              </Button>
            </div>
          ) : (
            <div className="h-2xl" />
          )}
        </div>
      ) : null}
    </>
  );
}
