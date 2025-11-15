import dayjs from "dayjs";
import { CalendarDays, MessageSquare } from "lucide-react";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import TextEditorContent from "../ui/textEditorContent";
import UserImage from "../ui/userImage";

type QuestionCardProps = {
  question: {
    id: string;
    title: string;
    description: string;
    author: {
      name: string;
      profilePicture: string | null;
    };
    answersCount: number;
    createdAt: Date;
  };
};

const QuestionCard = ({ question }: QuestionCardProps) => {
  return (
    <div className="p-[1em] bordered-card flex flex-col gap-2 items-start">
      <div className="flex items-center gap-2 pb-2 border-b-2 border-solid border-foreground/10">
        <UserImage user={question?.author} className="w-[30px]" />
        <div className="font-montserrat font-medium">
          {question?.author?.name}
        </div>
        <div className="flex items-center gap-1 text-xs opacity-50">
          <CalendarDays className="w-3" />
          {dayjs(question?.createdAt).format("MMM D, YYYY")}
        </div>
      </div>

      <div className="font-semibold text-base md:text-xl leading-tight">
        {question?.title}
      </div>
      <>
        {question?.description && (
          <TextEditorContent content={question?.description} />
        )}
      </>

      <div className="flex mt-1">
        <div className="text-xs flex gap-2 py-1 px-2 font-semibold">
          <MessageSquare size={16} />
          <>{question?.answersCount || "No"} Answers</>
        </div>
      </div>
    </div>
  );
};

const QuestionCardSkeleton: React.FC = () => {
  return (
    <div className="p-[1em] bordered-card flex flex-col gap-2 items-start">
      <div className="flex items-center gap-2 pb-2 border-b-2 border-solid border-foreground/10">
        <Skeleton className="rounded-full h-[30px] w-[30px]" />
        <Skeleton className="h-6 w-28" />
        <div className="flex items-center gap-1 text-xs opacity-50">
          <CalendarDays className="w-3" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      <Skeleton className="h-7 w-2/3" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />

      <div className="flex mt-1">
        <div className="text-xs flex gap-2 py-1 px-2 font-semibold">
          <MessageSquare size={16} />
          <Skeleton className="h-[15px] w-[80px]" />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
export { QuestionCardSkeleton };
