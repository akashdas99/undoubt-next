import {
  defaultShouldDehydrateQuery,
  environmentManager,
  QueryClient,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // Include pending queries so we can prefetch without await and stream
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        shouldRedactErrors: () => {
          // Do not redact Next.js server errors — that's how Next detects dynamic pages.
          // Next also redacts errors for us with better digests.
          return false;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export default function getQueryClient() {
  if (environmentManager.isServer()) {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: reuse one client so React suspends don't recreate it
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
