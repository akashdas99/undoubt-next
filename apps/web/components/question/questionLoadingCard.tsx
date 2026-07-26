import React from "react";
import { Skeleton } from "@workspace/ui/components/skeleton";

const QuestionLoadingCard = () => {
  return (
    <div className="bordered-card flex flex-col gap-2 p-[1em]">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-80" />
      <Skeleton className="h-6 w-20" />
    </div>
  );
};

export default QuestionLoadingCard;
