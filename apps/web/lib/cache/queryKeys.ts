/**
 * Query key factory for centralized, type-safe React Query key management.
 * Use these functions to generate consistent query keys across the app.
 */

export const queryKeys = {
  // Questions
  questions: {
    all: () => ["questions"] as const,
    list: (keyword: string = "", userId?: string | null) =>
      ["questions", "list", keyword, userId] as const,
    search: (keyword: string) => ["questions", "search", keyword] as const,
    detail: (id: string) => ["questions", "detail", id] as const,
  },

  // User votes
  userVotes: {
    all: () => ["userVotes"] as const,
    byQuestion: (questionId: string) => ["userVotes", questionId] as const,
  },

  // Users
  users: {
    all: () => ["users"] as const,
    profile: (userId: string) => ["users", "profile", userId] as const,
  },
} as const;
