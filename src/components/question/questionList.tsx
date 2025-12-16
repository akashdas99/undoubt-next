import { unstable_cache } from "next/cache";
import { getQuestions } from "@/data/question";
import InfiniteQuestionList from "./infiniteQuestionList";

const getCachedQuestions = unstable_cache(
  async () => getQuestions(),
  [`questions`],
  {
    tags: ["questions"],
    revalidate: 600,
  }
);

const QuestionList: React.FC = async () => {
  const result = await getCachedQuestions();
  const questions = result.data;
  console.log(result.pagination);
  const hasMore = result.pagination.totalPages > result.pagination.page;

  return (
    <div className="w-full my-3 md:my-8 max-w-screen-lg px-3">
      <div className="active-neo section-heading mb-2 font-righteous text-xl md:text-3xl">
        Recent Questions
      </div>
      <InfiniteQuestionList
        initialQuestions={questions}
        initialHasMore={hasMore}
      />
    </div>
  );
};

export default QuestionList;
