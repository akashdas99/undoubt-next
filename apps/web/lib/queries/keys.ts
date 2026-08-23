/**
 * Query key factory for centralized, type-safe React Query key management.
 * Use these functions to generate consistent query keys across the app.
 */

export const queryKeys = {
  questions: {
    all: () => ["questions"] as const,
    lists: () => [...queryKeys.questions.all(), "list"] as const,
    list: (keyword: string = "", userId?: string | null) =>
      [...queryKeys.questions.lists(), keyword, userId] as const,
    search: (keyword: string) =>
      [...queryKeys.questions.all(), "search", keyword] as const,
    detail: (id: string) =>
      [...queryKeys.questions.all(), "detail", id] as const,
  },

  users: {
    all: () => ["users"] as const,
    // Session profile for useProfile / SSR hydrate (no userId param)
    profile: () => [...queryKeys.users.all(), "profile"] as const,
  },
} as const;
