import { SessionWrapper } from "@/components/common/sessionWrapper";
import { Suspense } from "react";
import QuestionDetailCard from "./questionDetailCard";
import QuestionDetailFooter, {
  QuestionDetailFooterSkeleton,
} from "./questionDetailFooter";

export default async function QuestionSection({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug = "" } = await params;

  return (
    <QuestionDetailCard slug={slug}>
      <Suspense fallback={<QuestionDetailFooterSkeleton />}>
        <SessionWrapper
          render={(session) => (
            <QuestionDetailFooter slug={slug} userId={session?.id ?? null} />
          )}
        />
      </Suspense>
    </QuestionDetailCard>
  );
}
