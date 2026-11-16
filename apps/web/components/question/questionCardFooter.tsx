import { cn } from "@/lib/utils";
import { Question } from "@/lib/queries/questions";
import { CardFooter } from "@workspace/ui/components/card";
import { MessageSquare } from "lucide-react";
import QuestionShareButton from "./questionShareButton";

type QuestionCardFooterQuestion = Pick<Question, "answersCount" | "slug"> &
  Partial<Pick<Question, "title">>;

export function QuestionCardFooter({
  question,
  showShare = false,
  renderVote,
}: {
  question: QuestionCardFooterQuestion;
  showShare?: boolean;
  renderVote: () => React.ReactNode;
}) {
  const answersCount = question.answersCount ?? 0;

  return (
    <CardFooter className="justify-between text-xs">
      <div className="flex items-center gap-md">
        <div
          className={cn(
            "flex items-center gap-xs font-semibold",
            answersCount > 0 ? "text-primary" : "text-muted-foreground"
          )}
        >
          <MessageSquare size={16} />
          <span>
            {answersCount > 0
              ? `${answersCount} ${answersCount === 1 ? "Answer" : "Answers"}`
              : "No answers yet"}
          </span>
        </div>
        {showShare && question.title && (
          <QuestionShareButton slug={question.slug} title={question.title} />
        )}
      </div>
      <div className="relative z-10">{renderVote()}</div>
    </CardFooter>
  );
}
