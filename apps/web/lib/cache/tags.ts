/**
 * Cache tag factory for centralized, type-safe cache tag management.
 * Use these functions to generate consistent cache tags across the app.
 */

export const cacheTags = {
  // Users
  userProfile: () => "user-profile" as const,
} as const;

// Type helper for cache tag values
export type CacheTag = ReturnType<(typeof cacheTags)[keyof typeof cacheTags]>;
