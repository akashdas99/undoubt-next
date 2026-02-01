import { SessionWrapper } from "@/components/common/sessionWrapper";
import TopContributorsList from "@/components/contributors/topContributorsList";
import { QuestionCardSkeleton } from "@/components/question/questionCard";
import QuestionList from "@/components/question/questionList";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

function QuestionListFallback() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <QuestionCardSkeleton key={i} />
      ))}
    </div>
  );
}

function ContributorsFallback() {
  return (
    <aside className="hidden lg:block p-3 sticky z-10 top-[60px] self-start">
      <div className="mb-3 font-righteous text-3xl">Top Contributors</div>
      <div className="space-y-3 p-3 pr-5 bordered-card w-[384px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
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
    <div className="flex gap-6 w-full justify-center">
      <div className="w-full my-3 max-w-screen-lg px-3">
        <div className="mb-3 font-righteous text-3xl">Recent Questions</div>
        <Suspense fallback={<QuestionListFallback />}>
          <SessionWrapper
            render={(userId) => <QuestionList userId={userId} />}
          />
        </Suspense>
      </div>
      <Suspense fallback={<ContributorsFallback />}>
        <TopContributorsList />
      </Suspense>
    </div>
  );
}
