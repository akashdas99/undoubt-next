"use client";

import {
  useGetQuestionsInfiniteQuery,
  type Question,
  questionApi,
  useGetUserVotesQuery,
} from "@/lib/store/questions/question";
import { useEffect, useRef } from "react";
import QuestionCard from "./questionCard";
import { useDispatch } from "react-redux";

type InfiniteQuestionListProps = {
  initialQuestions: Question[];
  initialPagination: { page: number; totalPages: number };
};

export default function InfiniteQuestionList({
  initialQuestions,
  initialPagination,
}: InfiniteQuestionListProps) {
  const dispatch = useDispatch();
  const observerRef = useRef<HTMLDivElement>(null);
  // Use util.upsertQueryData to populate RTK Query cache with server data
  // This prevents the client from refetching data that was already loaded on server
  useEffect(() => {
    // For infinite queries, the cache structure is different from regular queries
    // We need to bypass TypeScript here because upsertQueryData expects single response
    // but infinite queries store data as { pages: [...], pageParams: [...] }
    const cacheData = {
      pages: [
        {
          data: initialQuestions?.map((q) => ({
            ...q,
            createdAt: q?.createdAt?.toISOString?.(),
          })),
          pagination: initialPagination,
        },
      ],
      pageParams: [1],
    };

    // @ts-expect-error - upsertQueryData types don't account for infinite query structure
    dispatch(questionApi.util.upsertQueryData("getQuestions", "", cacheData));
  }, [dispatch, initialQuestions, initialPagination]);

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
    useGetQuestionsInfiniteQuery("");

  const questions =
    (data?.pages?.map(({ data }) => data).flat() ?? []) || initialQuestions;

  useGetUserVotesQuery(data?.pages?.at(-1)?.data?.map(({ id }) => id) || [], {
    skip: !data,
  });
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
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
      <div className="flex flex-col gap-5">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} asLink />
        ))}
      </div>

      {hasNextPage && (
        <div ref={observerRef} className="py-8 text-center">
          {isFetching ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              <span>Loading more questions...</span>
            </div>
          ) : (
            <div className="h-10" />
          )}
        </div>
      )}

      {!hasNextPage && questions.length > 0 && (
        <div className="py-8 text-center text-gray-500">
          No more questions to load
        </div>
      )}
    </>
  );
}
