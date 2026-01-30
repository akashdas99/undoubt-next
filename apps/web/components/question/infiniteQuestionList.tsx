"use client";

import { INTERSECTION_THRESHOLD } from "@/lib/constants";
import { useAppDispatch } from "@/lib/store/hooks";
import {
  questionApi,
  useGetQuestionsInfiniteQuery,
  useGetUserVotesQuery,
  type Question,
} from "@/lib/store/questions/question";
import { useEffect, useRef } from "react";
import QuestionCard from "./questionCard";
import QuestionDeleteModal from "./questionDeleteModal";

type InfiniteQuestionListProps = {
  initialQuestions: Question[];
  initialPagination: { page: number; totalPages: number };
};

export default function InfiniteQuestionList({
  initialQuestions,
  initialPagination,
}: InfiniteQuestionListProps) {
  const dispatch = useAppDispatch();
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
            createdAt:
              q?.createdAt instanceof Date
                ? q.createdAt.toISOString()
                : q.createdAt,
          })),
          pagination: initialPagination,
        },
      ],
      pageParams: [1],
    };

    dispatch((dispatch, getState) => {
      const state = getState();

      const isCached = Object.values(state.getQuestions.queries).find(
        (query) =>
          query?.endpointName === "getQuestions" &&
          query.status === "fulfilled",
      );

      if (!isCached) {
        // First render: initialize cache with server data
        dispatch(
          questionApi.util.upsertQueryData("getQuestions", "", cacheData),
        );
      } else {
        // Subsequent renders: update first page and remove duplicates from other pages
        dispatch(
          questionApi.util.updateQueryData("getQuestions", "", (draft) => {
            const firstPage = cacheData.pages[0];
            if (!firstPage) return;

            // Get IDs of questions in the new first page
            const newPageQuestionIds = new Set(
              firstPage.data?.map((q) => q.id) || [],
            );

            // Update first page
            draft.pages[0] = firstPage;

            // Remove duplicates from other pages
            for (let i = 1; i < draft.pages.length; i++) {
              const page = draft.pages[i];
              if (page?.data) {
                page.data = page.data.filter(
                  (q) => !newPageQuestionIds.has(q.id),
                );
              }
            }

            // Remove empty pages
            draft.pages = draft.pages.filter(
              (page) => page.data && page.data.length > 0,
            );

            // Update pageParams to match remaining pages
            draft.pageParams = draft.pageParams.slice(0, draft.pages.length);
          }),
        );
      }
    });
  }, [initialQuestions]);

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
    useGetQuestionsInfiniteQuery("");

  const questions = data?.pages?.map(({ data }) => data).flat() ?? [];

  useGetUserVotesQuery(data?.pages?.at(-1)?.data?.map(({ id }) => id) || [], {
    skip: !data,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { threshold: INTERSECTION_THRESHOLD },
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
          <QuestionCard key={question?.id} question={question} />
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

      <QuestionDeleteModal />
    </>
  );
}
