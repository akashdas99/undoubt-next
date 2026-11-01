import { getQuestionBySlugAction } from "@/actions/question";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queries/keys";
import { QUESTIONS_PER_PAGE } from "@/lib/constants";
import {
  type InfiniteData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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
  userVote: number | null;
};

export type PaginatedResponse = {
  data: Question[];
  pagination: {
    page: number;
    totalPages: number;
  };
};

type InfiniteQuestions = InfiniteData<PaginatedResponse, number>;
type QuestionPatch =
  | Partial<Question>
  | ((question: Question) => Partial<Question>);

function applyQuestionPatch(question: Question, patch: QuestionPatch) {
  const next = typeof patch === "function" ? patch(question) : patch;
  return { ...question, ...next };
}

/** Patch one question in every cached list and every cached detail query. */
export function useUpdateQuestionCache() {
  const queryClient = useQueryClient();
  const listsKey = queryKeys.questions.lists();
  const detailsKey = queryKeys.questions.details();

  const updateQuestion = (questionId: string, patch: QuestionPatch) => {
    queryClient.setQueriesData<InfiniteQuestions>(
      { queryKey: listsKey },
      (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data?.map((question) =>
              question.id === questionId
                ? applyQuestionPatch(question, patch)
                : question
            ),
          })),
        };
      }
    );

    queryClient.setQueriesData<Question>({ queryKey: detailsKey }, (old) =>
      old?.id === questionId ? applyQuestionPatch(old, patch) : old
    );
  };

  const removeQuestion = (questionId: string) => {
    queryClient.setQueriesData<InfiniteQuestions>(
      { queryKey: listsKey },
      (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data?.filter((question) => question.id !== questionId),
          })),
        };
      }
    );

    queryClient
      .getQueriesData<Question>({ queryKey: detailsKey })
      .forEach(([key, question]) => {
        if (question?.id === questionId) {
          queryClient.removeQueries({ queryKey: key });
        }
      });
  };

  return {
    updateQuestion,
    removeQuestion,
  };
}

type SearchResult = { label: string; value: string };
type SearchResponse = { data: { title: string; slug: string }[] };

export function useQuestion(slug: string) {
  return useQuery({
    queryKey: queryKeys.questions.detail(slug),
    queryFn: () => getQuestionBySlugAction(slug),
    enabled: !!slug,
  });
}

// Search questions by keyword (for autocomplete)
export function useQuestionsByKeyword(keyword: string) {
  return useQuery<SearchResult[]>({
    queryKey: queryKeys.questions.search(keyword),
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
export function useQuestionsInfinite(
  keyword: string = "",
  userId?: string | null
) {
  return useInfiniteQuery({
    queryKey: queryKeys.questions.list(keyword, userId),
    queryFn: async ({ pageParam }) => {
      const data = await api.get<PaginatedResponse>("/api/questions", {
        params: {
          page: pageParam,
          limit: QUESTIONS_PER_PAGE,
          keyword,
        },
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
