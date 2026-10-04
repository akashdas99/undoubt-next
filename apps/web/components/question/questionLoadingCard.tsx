import React from "react";
import { Skeleton } from "@workspace/ui/components/skeleton";

const QuestionLoadingCard = () => {
  return (
    <div className="bordered-card flex flex-col gap-xs p-md">
      <Skeleton className="h-xl w-full" />
      <Skeleton className="h-xl w-(--container-narrow)" />
      <Skeleton className="h-xl w-3xl" />
    </div>
  );
};

export default QuestionLoadingCard;
