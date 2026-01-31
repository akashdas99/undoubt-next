import { QueryClient, QueryClientConfig } from "@tanstack/react-query";
import { cache } from "react";

// Shared configuration for QueryClient
export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
};

// Create a singleton QueryClient for server components
// Using React's cache() ensures the same instance is used per request
const getQueryClient = cache(() => new QueryClient(queryClientConfig));

export default getQueryClient;
