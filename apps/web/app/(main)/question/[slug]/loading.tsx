import AddAnswer from "@/components/answer/addAnswer";
import { AnswerCardSkeleton } from "@/components/answer/answerCard";
import { QuestionCardSkeleton } from "@/components/question/questionCardSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto my-xl w-full max-w-content px-xl">
      <div className="flex flex-col gap-md">
        <QuestionCardSkeleton />
        <AddAnswer />
        <div className="bordered-card p-md">
          <div className="active-neo section-heading mb-xs font-display text-title">
            Recent Answers
          </div>
          <div className="flex flex-col gap-md">
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
