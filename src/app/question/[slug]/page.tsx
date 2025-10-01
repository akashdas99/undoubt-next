import AddAnswer from "@/components/answer/addAnswer";
import AnswerList from "@/components/answer/answerList";
import QuestionSection from "@/components/question/questionSection";
import { getQuestions } from "@/services/question";

export async function generateStaticParams() {
  const questions = await getQuestions();
  return questions.map((question) => ({ slug: question?.slug }));
}

/**
 * Renders the question page with the question details, an add-answer form, and a recent answers list.
 *
 * @param params - A promise resolving to route parameters; expected shape: `{ slug: string }`.
 * @returns The page's React element containing the question section, add-answer component, and recent answers list.
 */
export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="w-full my-3 md:my-8 max-w-screen-lg px-3">
      <div className="flex flex-col gap-5">
        <QuestionSection params={params} />
        <AddAnswer />
        <div className="bordered-card p-[1em]">
          <div className="active-neo section-heading mb-2 font-righteous text-xl">
            Recent Answers
          </div>
          <AnswerList params={params} />
        </div>
      </div>
    </div>
  );
}
