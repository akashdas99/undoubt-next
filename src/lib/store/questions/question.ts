import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { QUESTIONS_PER_PAGE } from "@/lib/constants";

export type Question = {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    profilePicture: string | null;
  };
  answersCount: number;
  createdAt: Date | string;
  authorId: string;
  slug: string;
  likes: number;
  dislikes: number;
};

export type PaginatedResponse = {
  data: Question[];
  pagination: {
    page: number;
    totalPages: number;
  };
};

export const questionApi = createApi({
  reducerPath: "getQuestions",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASEURL }),
  tagTypes: ["search", "questions", "userVotes"],
  endpoints: (builder) => ({
    getAllQuestionsByKeyword: builder.query({
      query: (keyword) => `/api/questions?keyword=${keyword}`,
      transformResponse: (response: { title: string; slug: string }[]) =>
        response?.map((question: { title: string; slug: string }) => ({
          label: question?.title,
          value: question?.slug,
        })),
      providesTags: ["search"],
    }),
    getQuestions: builder.infiniteQuery<
      { data: Question[]; pagination: { page: number; totalPages: number } },
      string,
      number
    >({
      infiniteQueryOptions: {
        // Must provide a default initial page param value
        initialPageParam: 1,

        getNextPageParam: (lastPage, allPages, lastPageParam) =>
          lastPage?.pagination?.page < lastPage?.pagination?.totalPages
            ? lastPageParam + 1
            : undefined,
      },
      // The `query` function receives `{queryArg, pageParam}` as its argument
      query({ queryArg: keyword, pageParam }) {
        return `/api/questions?page=${pageParam}&limit=${QUESTIONS_PER_PAGE}&keyword=${keyword}`;
      },
    }),
    getUserVotes: builder.query<Record<string, number | null>, string[]>({
      query: (questionIds) => ({
        url: `/api/questions/userVotes?questionIds=${questionIds.join(",")}`,
      }),
      transformResponse: (response: Record<string, number | null>) => {
        return response;
      },
      providesTags: (result, error, arg) => {
        return arg.map((id) => ({ type: "userVotes", id }));
      },
    }),
  }),
});

export const {
  useGetAllQuestionsByKeywordQuery,
  useGetQuestionsInfiniteQuery,
  useGetUserVotesQuery,
} = questionApi;

// Base selectors
const selectQuestionQueries = (state: RootState) => state.getQuestions.queries;

// Memoized selector to get all getUserVotes queries
export const selectUserVotesQueries = createSelector(
  [selectQuestionQueries],
  (queries) =>
    Object.values(queries).filter(
      (query) => query?.endpointName === "getUserVotes"
    )
);

// Memoized selector to get vote by question ID
export const selectVoteByQuestionId = createSelector(
  [
    selectUserVotesQueries,
    (_state: RootState, questionId: string) => questionId,
  ],
  (userVotesQueries, questionId) => {
    const batchQuery = userVotesQueries.find(
      (query) =>
        (query?.data as Record<string, number | null>)?.[questionId] !==
        undefined
    );

    const data = batchQuery?.data as Record<string, number | null> | undefined;
    return (data?.[questionId] ?? null) as -1 | 1 | null;
  }
);

// Memoized selector to get question from cache by ID
export const selectQuestionById = createSelector(
  [
    selectQuestionQueries,
    (_state: RootState, questionId: string) => questionId,
  ],
  (queries, questionId) => {
    const questionsQuery = Object.values(queries).find(
      (query) =>
        query?.endpointName === "getQuestions" && query.status === "fulfilled"
    );

    if (questionsQuery?.data) {
      const data = questionsQuery.data as {
        pages: Array<{
          data?: Array<{ id: string; likes?: number; dislikes?: number }>;
        }>;
      };

      for (const page of data.pages) {
        const question = page.data?.find((q) => q.id === questionId);
        if (question) return question;
      }
    }

    return null;
  }
);
