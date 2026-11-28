import { apiRequest, httpMethod, type ApiRequest } from "@/lib/api/request";
import { answerEndpoints } from "@/lib/domain/endpoints";
import { queryKeys } from "@/lib/queries/keys";
import { useInfiniteQuery } from "@tanstack/react-query";

export type AnswerListItem = {
  id: string;
  description: string;
  authorId: string;
  questionId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  author: { name: string; profilePicture: string | null };
};

export type AnswerListPage = {
  data: AnswerListItem[];
  pagination: {
    nextCursor: string | null;
  };
};

export async function fetchAnswerPage(
  request: ApiRequest,
  slug: string,
  cursor: string | null
): Promise<AnswerListPage> {
  const { response, error } = await request<AnswerListPage>(
    answerEndpoints.list(slug),
    {
      method: httpMethod.get,
      searchParams: { cursor: cursor ?? undefined },
    }
  );
  if (error) {
    throw error;
  }
  if (!response?.data) {
    throw new Error("Could not load answers");
  }
  return response;
}

export function useAnswersInfinite(slug: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.answers.list(slug),
    queryFn: ({ pageParam }) => fetchAnswerPage(apiRequest, slug, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor ?? undefined,
  });
}
