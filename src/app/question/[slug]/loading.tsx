import AddAnswer from "@/components/answer/addAnswer";
import { AnswerCardSkeleton } from "@/components/answer/answerCard";
import { QuestionCardSkeleton } from "@/components/question/questionCard";

/**
 * Render the composed loading UI for a question page.
 *
 * Renders skeleton placeholders for the question card, an answer composer, and a stacked list of recent answer skeletons.
 *
 * @returns A JSX element that displays the loading skeletons for a question, the add-answer interface, and recent answers.
 */
export default function Loading() {
  return (
    <div className="w-full my-3 md:my-8 max-w-screen-lg px-3">
      <div className="flex flex-col gap-5">
        <QuestionCardSkeleton />
        <AddAnswer />
        <div className="bordered-card p-[1em]">
          <div className="active-neo section-heading mb-2 font-righteous text-xl">
            Recent Answers
          </div>
          <div className="flex flex-col gap-5">
            <AnswerCardSkeleton />
            <AnswerCardSkeleton />
            <AnswerCardSkeleton />
            <AnswerCardSkeleton />
            <AnswerCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
