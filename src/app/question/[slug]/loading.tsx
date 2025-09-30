import { AddAnswerContainerSkeleton } from "@/components/answer/addAnswerContainer";
import { AnswerCardSkeleton } from "@/components/answer/answerCard";
import { QuestionCardSkeleton } from "@/components/question/questionCard";

export default function Loading() {
  return (
    <div className="w-full my-3 md:my-8 max-w-screen-lg px-3">
      <div className="flex flex-col gap-5">
        <QuestionCardSkeleton />
        <AddAnswerContainerSkeleton />
        <div className="bordered-card p-[1em]">
          <div className="active-neo section-heading mb-2 font-righteous text-xl">
            Recent Answers
          </div>
          <AnswerCardSkeleton />
          <AnswerCardSkeleton />
          <AnswerCardSkeleton />
          <AnswerCardSkeleton />
          <AnswerCardSkeleton />
        </div>
      </div>
    </div>
  );
}
