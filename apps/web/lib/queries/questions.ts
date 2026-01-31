import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { QUESTIONS_PER_PAGE } from "@/lib/constants";
import { api } from "@/lib/api";

export type Question = {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    profilePicture: string | null;
  };
  answersCount: number;
  createdAt: Date | string;
  authorId: string;
  slug: string;
  likes: number;
  dislikes: number;
};

export type PaginatedResponse = {
  data: Question[];
  pagination: {
    page: number;
    totalPages: number;
  };
};

type SearchResult = { label: string; value: string };
type SearchResponse = { data: { title: string; slug: string }[] };

// Search questions by keyword (for autocomplete)
export function useQuestionsByKeyword(keyword: string) {
  return useQuery<SearchResult[]>({
    queryKey: ["questions", "search", keyword],
    queryFn: async () => {
      const data = await api.get<SearchResponse>("/api/questions", {
        params: { keyword },
      });
      return data?.data?.map((q) => ({ label: q.title, value: q.slug })) ?? [];
    },
    enabled: !!keyword,
  });
}

// Infinite scroll questions
export function useQuestionsInfinite(keyword: string = "") {
  return useInfiniteQuery({
    queryKey: ["questions", "list", keyword],
    queryFn: async ({ pageParam }) => {
      const data = await api.get<PaginatedResponse>("/api/questions", {
        params: { page: pageParam, limit: QUESTIONS_PER_PAGE, keyword },
      });
      return data ?? { data: [], pagination: { page: 1, totalPages: 1 } };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.page < lastPage?.pagination?.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });
}

// Get user votes for questions
export function useUserVotes(questionIds: string[]) {
  return useQuery({
    queryKey: ["userVotes", questionIds],
    queryFn: () =>
      api.get<Record<string, number | null>>("/api/questions/userVotes", {
        params: { questionIds: questionIds.join(",") },
      }),
    enabled: questionIds.length > 0,
  });
}

// Helper hook to get vote for a specific question
export function useVoteByQuestionId(questionId: string) {
  const queryClient = useQueryClient();

  // Look through all userVotes queries to find the vote for this question
  const queriesData = queryClient.getQueriesData<Record<string, number | null>>(
    {
      queryKey: ["userVotes"],
    },
  );

  for (const [, data] of queriesData) {
    if (data?.[questionId] !== undefined) {
      return data[questionId] as -1 | 1 | null;
    }
  }

  return null;
}

// Helper hook to get a question from cache by ID
export function useQuestionById(questionId: string) {
  const queryClient = useQueryClient();

  const queriesData = queryClient.getQueriesData<{
    pages: PaginatedResponse[];
  }>({
    queryKey: ["questions", "list"],
  });

  for (const [, data] of queriesData) {
    if (data?.pages) {
      for (const page of data.pages) {
        const question = page.data?.find((q) => q.id === questionId);
        if (question) return question;
      }
    }
  }

  return null;
}
