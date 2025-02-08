import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const questionApi = createApi({
  reducerPath: "getQuestions",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_VERCEL_URL }),
  endpoints: (builder) => ({
    getAllQuestionsByKeyword: builder.query({
      query: (keyword) => `api/questions?keyword=${keyword}`,
      transformResponse: (response: { description: string; _id: string }[]) =>
        response?.map((question: { description: string; _id: string }) => ({
          label: question?.description,
          value: question?._id,
        })),
    }),
  }),
});
export const { useGetAllQuestionsByKeywordQuery } = questionApi;
