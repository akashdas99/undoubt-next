import {
  formatCreatedAt,
  formatExactDateTime,
  toDateTimeAttribute,
} from "@/lib/date";
import { Question } from "@/lib/queries/questions";
import { CardHeader, CardTitle } from "@workspace/ui/components/card";
import UserImage from "../ui/userImage";
import QuestionCardActions from "./questionCardActions";

type QuestionCardHeaderQuestion = Pick<
  Question,
  "id" | "authorId" | "slug" | "author" | "createdAt"
>;

export function QuestionCardHeader({
  question,
}: {
  question: QuestionCardHeaderQuestion;
}) {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-xs">
        <UserImage user={question.author} className="w-2xl" />
        <span className="font-sans text-xs font-medium">
          {question.author?.name}
        </span>
        <span className="text-xs font-normal text-muted-foreground">·</span>
        <time
          dateTime={toDateTimeAttribute(question.createdAt)}
          title={formatExactDateTime(question.createdAt)}
          suppressHydrationWarning
          className="text-xs font-normal text-muted-foreground"
        >
          {formatCreatedAt(question.createdAt)}
        </time>
      </CardTitle>
      <QuestionCardActions question={question} />
    </CardHeader>
  );
}
