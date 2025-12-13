import QuestionCard from "./questionCard";
import { unstable_cache } from "next/cache";
import { getQuestions } from "@/data/question";
const getCachedQuestions = unstable_cache(
  async () => getQuestions(),
  [`questions`],
  {
    tags: ["questions"],
    revalidate: 600,
  }
);
const QuestionList: React.FC = async () => {
  const questions = await getCachedQuestions();

  return (
    <div className="w-full my-3 md:my-8 max-w-screen-lg px-3">
      <div className="active-neo section-heading mb-2 font-righteous text-xl md:text-3xl">
        Recent Questions
      </div>
      {questions.length === 0 ? (
        <p>No Questions</p>
      ) : (
        <div className="flex flex-col gap-5">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} asLink />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
