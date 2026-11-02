import { AnswerCardSkeleton } from "./answerCard";

export function AnswerListSkeleton() {
  return (
    <div className="flex flex-col gap-md">
      {Array.from({ length: 5 }, (_, index) => (
        <AnswerCardSkeleton key={index} />
      ))}
    </div>
  );
}
