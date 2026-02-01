import { getQuestions } from "@/data/question";
import getQueryClient from "@/lib/getQueryClient";
import { QUESTIONS_PER_PAGE } from "@/lib/constants";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import InfiniteQuestionList from "./infiniteQuestionList";

const QuestionList: React.FC = async () => {
  const queryClient = getQueryClient();

  // Prefetch the infinite query on the server
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["questions", "list", ""],
    queryFn: async () => {
      const result = await getQuestions("", QUESTIONS_PER_PAGE, 1);
      return {
        data: result.data.map((q) => ({
          ...q,
          createdAt:
            q.createdAt instanceof Date
              ? q.createdAt.toISOString()
              : q.createdAt,
        })),
        pagination: result.pagination,
      };
    },
    initialPageParam: 1,
  });

  return (
    <div className="w-full my-3 max-w-screen-lg px-3">
      <div className="mb-3 font-righteous text-3xl">Recent Questions</div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <InfiniteQuestionList />
      </HydrationBoundary>
    </div>
  );
};

export default QuestionList;
