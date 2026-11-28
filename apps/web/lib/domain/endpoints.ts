export const questionEndpoints = {
  list: "/questions",
  slugs: "/questions/slugs",
  bySlug: (slug: string) => `/questions/${encodeURIComponent(slug)}`,
  content: (slug: string) => `/questions/${encodeURIComponent(slug)}/content`,
  stats: (slug: string) => `/questions/${encodeURIComponent(slug)}/stats`,
  create: "/questions",
  update: (id: string) => `/questions/${id}`,
  delete: (id: string) => `/questions/${id}`,
  vote: (id: string) => `/questions/${id}/vote`,
} as const;

export const answerEndpoints = {
  list: (slug: string) => `/questions/${encodeURIComponent(slug)}/answers`,
  create: (slug: string) => `/questions/${encodeURIComponent(slug)}/answers`,
  update: (id: string) => `/answers/${id}`,
  delete: (id: string) => `/answers/${id}`,
} as const;

export const userEndpoints = {
  me: "/users/me",
  byId: (id: string) => `/users/${id}`,
  top: "/users/top",
} as const;
