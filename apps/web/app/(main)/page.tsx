import { SessionWrapper } from "@/components/common/sessionWrapper";
import TopContributorsList from "@/components/contributors/topContributorsList";
import { QuestionCardSkeleton } from "@/components/question/questionCard";
import QuestionList from "@/components/question/questionList";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Suspense } from "react";

function QuestionListFallback() {
  return (
    <div className="flex flex-col gap-lg">
      {Array.from({ length: 3 }).map((_, i) => (
        <QuestionCardSkeleton key={i} />
      ))}
    </div>
  );
}

function ContributorsFallback() {
  return (
    <aside className="sticky top-3xl z-10 hidden self-start p-md lg:block">
      <div className="mb-md font-display text-display">Top Contributors</div>
      <div className="bordered-card flex w-(--container-dialog) flex-col gap-sm p-md">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-sm">
            <Skeleton className="size-2xl rounded-full" />
            <div className="flex-1 space-y-xs">
              <Skeleton className="h-md w-3xl" />
              <Skeleton className="h-sm w-3xl" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function Home() {
  return (
    <div className="flex w-full justify-center gap-xl py-md">
      <div className="w-full max-w-content px-md">
        <div className="mb-md font-display text-display">Recent Questions</div>
        <Suspense fallback={<QuestionListFallback />}>
          <SessionWrapper
            render={(user) => <QuestionList userId={user?.id ?? null} />}
          />
        </Suspense>
      </div>
      <Suspense fallback={<ContributorsFallback />}>
        <TopContributorsList />
      </Suspense>
    </div>
  );
}
