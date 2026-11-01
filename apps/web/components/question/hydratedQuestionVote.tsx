import getQueryClient from "@/lib/getQueryClient";
import { queryKeys } from "@/lib/queries/keys";
import { Question } from "@/lib/queries/questions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import QuestionVoteButton from "./questionVoteButton";

type QuestionVoteState = Pick<
  Question,
  "id" | "slug" | "likes" | "dislikes" | "userVote"
>;

export default function HydratedQuestionVote({
  question,
}: {
  question: QuestionVoteState;
}) {
  const queryClient = getQueryClient();
  queryClient.setQueryData<QuestionVoteState>(
    queryKeys.questions.detail(question.slug),
    question
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuestionVoteButton
        questionId={question.id}
        slug={question.slug}
        likes={question.likes ?? 0}
        dislikes={question.dislikes ?? 0}
        userVote={question.userVote}
      />
    </HydrationBoundary>
  );
}
