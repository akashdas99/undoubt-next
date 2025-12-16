import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Question = {
  id: string;
  title: string;
  description: string;
  author: { name: string; profilePicture: string | null };
  authorId: string;
  createdAt: Date;
  answersCount: number;
  slug: string;
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
  tagTypes: ["search", "questions"],
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
      { data: Question; pagination: { page: number; totalPages: number } },
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
  }),
});

export const {
  useGetAllQuestionsByKeywordQuery,
  useGetQuestionsInfiniteQuery,
} = questionApi;
