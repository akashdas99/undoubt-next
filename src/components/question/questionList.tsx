import { getQuestions } from "@/services/question";
import QuestionCard from "./questionCard";
import Link from "next/link";
import { unstable_cache } from "next/cache";
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
    <div className="px-[8vw] my-3 md:my-8">
      <div className="active-neo section-heading mb-2 font-righteous text-xl">
        Recent Questions
      </div>
      {questions.length === 0 ? (
        <p>No Questions</p>
      ) : (
        <div className="flex flex-col gap-5">
          {questions.map((question, i) => (
            <Link key={i} href={"question/" + question?.slug}>
              <QuestionCard question={question} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
