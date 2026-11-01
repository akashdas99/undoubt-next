import { getQuestionStatsBySlug } from "@/data/question";
import { CardFooter } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { notFound } from "next/navigation";
import { QuestionCardFooter } from "./questionCardFooter";
import HydratedQuestionVote from "./hydratedQuestionVote";

export function QuestionDetailFooterSkeleton() {
  return (
    <CardFooter className="justify-between">
      <Skeleton className="h-md w-3xl" />
      <Skeleton className="h-xl w-3xl rounded-full" />
    </CardFooter>
  );
}

export default async function QuestionDetailFooter({
  slug,
  userId,
}: {
  slug: string;
  userId: string | null;
}) {
  const stats = await getQuestionStatsBySlug(slug, userId);
  if (!stats) notFound();

  const vote = {
    id: stats.id,
    slug,
    likes: stats.likes ?? 0,
    dislikes: stats.dislikes ?? 0,
    userVote: stats.userVote,
  };

  return (
    <QuestionCardFooter
      question={{ answersCount: stats.answersCount ?? 0, slug }}
      renderVote={() => <HydratedQuestionVote question={vote} />}
    />
  );
}
