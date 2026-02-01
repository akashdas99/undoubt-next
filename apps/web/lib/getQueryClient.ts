import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// Create a singleton QueryClient for server components
// Using React's cache() ensures the same instance is used per request
const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
        },
      },
    }),
);

export default getQueryClient;
