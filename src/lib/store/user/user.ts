import { User } from "@/models/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "getUserDetails",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASEURL }),
  tagTypes: ["profile"],
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => `/api/profile`,
      providesTags: ["profile"],
    }),
  }),
});
export const { useGetProfileQuery } = userApi;
