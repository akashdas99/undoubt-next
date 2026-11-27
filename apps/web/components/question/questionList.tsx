import getQueryClient from "@/lib/getQueryClient";
import { QUESTIONS_PER_PAGE } from "@/lib/constants";
import { serverReq } from "@/lib/api/with-session";
import { fetchQuestionPage } from "@/lib/queries/questions";
import { queryKeys } from "@/lib/queries/keys";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import InfiniteQuestionList from "./infiniteQuestionList";

interface QuestionListProps {
  userId?: string | null;
}

const QuestionList: React.FC<QuestionListProps> = async ({ userId }) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.questions.list("", userId),
    queryFn: () =>
      fetchQuestionPage(serverReq, {
        keyword: "",
        limit: QUESTIONS_PER_PAGE,
      }),
    initialPageParam: null as string | null,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InfiniteQuestionList userId={userId} />
    </HydrationBoundary>
  );
};

export default QuestionList;
