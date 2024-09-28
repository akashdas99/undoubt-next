import React from "react";
import { Skeleton } from "../ui/skeleton";

const QuestionLoadingCard = () => {
  return (
    <div className="p-[1em] neo flex flex-col gap-2">
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-80 h-6" />
      <Skeleton className="w-20 h-6" />
    </div>
  );
};

export default QuestionLoadingCard;
