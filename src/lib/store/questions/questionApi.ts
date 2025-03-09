import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const questionApi = createApi({
  reducerPath: "getQuestions",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASEURL }),
  endpoints: (builder) => ({
    getAllQuestionsByKeyword: builder.query({
      query: (keyword) => `/api/questions?keyword=${keyword}`,
      transformResponse: (response: { title: string; slug: string }[]) =>
        response?.map((question: { title: string; slug: string }) => ({
          label: question?.title,
          value: question?.slug,
        })),
    }),
  }),
});
export const { useGetAllQuestionsByKeywordQuery } = questionApi;
