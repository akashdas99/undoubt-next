import AddAnswer from "@/components/answer/addAnswer";
import { AnswerListSkeleton } from "@/components/answer/answerListSkeleton";
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
          <AnswerListSkeleton />
        </div>
      </div>
    </div>
  );
}
