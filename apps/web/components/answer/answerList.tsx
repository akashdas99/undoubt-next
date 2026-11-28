import { apiRequest } from "@/lib/api/request";
import getQueryClient from "@/lib/getQueryClient";
import { fetchAnswerPage } from "@/lib/queries/answers";
import { queryKeys } from "@/lib/queries/keys";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import AnswerListPages from "./answerListPages";

export default async function AnswerList({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug = "" } = await params;
  const queryClient = getQueryClient();

  await queryClient.infiniteQuery({
    queryKey: queryKeys.answers.list(slug),
    queryFn: () => fetchAnswerPage(apiRequest, slug, null),
    initialPageParam: null as string | null,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AnswerListPages slug={slug} />
    </HydrationBoundary>
  );
}
