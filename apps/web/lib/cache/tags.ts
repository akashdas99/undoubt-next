/**
 * Cache tag factory for centralized, type-safe Next.js cache tag management.
 * Use these with cacheTag() / revalidateTag().
 */

export const cacheTags = {
  users: {
    profile: () => "users:profile" as const,
  },
} as const;

type CacheTagLeaf = {
  [K in keyof typeof cacheTags]: (typeof cacheTags)[K][keyof (typeof cacheTags)[K]];
}[keyof typeof cacheTags];

export type CacheTag = ReturnType<CacheTagLeaf>;
