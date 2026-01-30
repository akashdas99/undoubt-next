import { cacheTag } from "next/cache";
import { getQuestions } from "@/data/question";
import InfiniteQuestionList from "./infiniteQuestionList";

async function getCachedQuestions() {
  "use cache";
  cacheTag("questions");
  return getQuestions();
}

const QuestionList: React.FC = async () => {
  const result = await getCachedQuestions();
  const questions = result.data;

  return (
    <div className="w-full my-3 max-w-screen-lg px-3">
      <div className="mb-3 font-righteous text-3xl">Recent Questions</div>
      <InfiniteQuestionList
        initialQuestions={questions}
        initialPagination={result.pagination}
      />
    </div>
  );
};

export default QuestionList;
