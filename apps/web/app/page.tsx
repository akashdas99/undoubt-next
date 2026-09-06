import { SessionWrapper } from "@/components/common/sessionWrapper";
import TopContributorsList from "@/components/contributors/topContributorsList";
import { QuestionCardSkeleton } from "@/components/question/questionCard";
import QuestionList from "@/components/question/questionList";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Suspense } from "react";

function QuestionListFallback() {
  return (
    <div className="flex flex-col gap-md">
      {Array.from({ length: 3 }).map((_, i) => (
        <QuestionCardSkeleton key={i} />
      ))}
    </div>
  );
}

function ContributorsFallback() {
  return (
    <aside className="sticky top-17 z-10 hidden self-start p-sm lg:block">
      <div className="mb-xs font-righteous text-display">Top Contributors</div>
      <div className="bordered-card w-[384px] space-y-3 p-md">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function Home() {
  return (
    <div className="flex w-full justify-center gap-sm">
      <div className="my-sm w-full max-w-content px-sm">
        <div className="mb-xs font-righteous text-display">Recent Questions</div>
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
