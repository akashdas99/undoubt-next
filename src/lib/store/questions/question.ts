import { createSelector } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export type Question = {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    profilePicture: string | null;
  };
  answersCount: number;
  createdAt: Date;
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
        return `/api/questions?page=${pageParam}&limit=${10}&keyword=${keyword}`;
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

// Simple non-memoized selector for when memoization is handled elsewhere
export const selectVoteByQuestionId = (
  state: RootState,
  questionId: string
): -1 | 1 | null => {
  const queries = state.getQuestions.queries;

  const batchQuery = Object.values(queries).find(
    (query) =>
      query?.endpointName === "getUserVotes" &&
      (query?.data as Record<string, number | null>)?.[questionId] !== undefined
  );

  const data = batchQuery?.data as Record<string, number | null> | undefined;
  return (data?.[questionId] ?? null) as -1 | 1 | null;
};
