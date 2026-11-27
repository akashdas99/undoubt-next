import {
  apiRequest,
  httpMethod,
  type ApiMethod,
  type ApiRequestInit,
  type ApiResult,
} from "@/lib/api/request";
import { questionEndpoints } from "@/lib/domain/endpoints";
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

export type QuestionContent = Pick<
  Question,
  "id" | "title" | "description" | "author" | "authorId" | "createdAt" | "slug"
>;

export type QuestionStats = Pick<
  Question,
  "id" | "answersCount" | "likes" | "dislikes" | "userVote"
>;

export type PaginatedResponse = {
  data: Question[];
  pagination: {
    nextCursor: string | null;
  };
};

type InfiniteQuestions = InfiniteData<PaginatedResponse, string | null>;
type QuestionPatch =
  | Partial<Question>
  | ((question: Question) => Partial<Question>);

function applyQuestionPatch(question: Question, patch: QuestionPatch) {
  const next = typeof patch === "function" ? patch(question) : patch;
  return { ...question, ...next };
}

type QuestionPageRequest = <T>(
  path: string,
  init: {
    method: ApiMethod;
    searchParams?: ApiRequestInit["searchParams"];
  }
) => Promise<ApiResult<T>>;

export async function fetchQuestionPage(
  request: QuestionPageRequest,
  searchParams: ApiRequestInit["searchParams"]
): Promise<PaginatedResponse> {
  const { response, error } = await request<PaginatedResponse>(
    questionEndpoints.list,
    { method: httpMethod.get, searchParams }
  );
  if (error || !response) {
    return { data: [], pagination: { nextCursor: null } };
  }
  return response;
}

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

export function useQuestion(slug: string) {
  return useQuery({
    queryKey: queryKeys.questions.detail(slug),
    queryFn: async () => {
      const { response, error } = await apiRequest<Question>(
        questionEndpoints.bySlug(slug),
        { method: httpMethod.get }
      );
      if (error || !response) {
        return null;
      }
      return response;
    },
    enabled: !!slug,
  });
}

export function useQuestionsByKeyword(keyword: string) {
  return useQuery<SearchResult[]>({
    queryKey: queryKeys.questions.search(keyword),
    queryFn: async () => {
      const page = await fetchQuestionPage(apiRequest, { keyword });
      return page.data.map((q) => ({ label: q.title, value: q.slug }));
    },
    enabled: !!keyword,
  });
}

export function useQuestionsInfinite(
  keyword: string = "",
  userId?: string | null
) {
  return useInfiniteQuery({
    queryKey: queryKeys.questions.list(keyword, userId),
    queryFn: ({ pageParam }) =>
      fetchQuestionPage(apiRequest, {
        cursor: pageParam ?? undefined,
        limit: QUESTIONS_PER_PAGE,
        keyword,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor ?? undefined,
  });
}
