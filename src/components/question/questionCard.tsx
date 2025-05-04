import { Question } from "@/models/question";
import { User } from "@/models/user";
import dayjs from "dayjs";
import { CalendarDays, MessageSquare } from "lucide-react";
import UserImage from "../ui/userImage";
import TextEditorContent from "../ui/textEditorContent";
import { Skeleton } from "../ui/skeleton";

export default async function QuestionCard({
  question,
  isLoading = false,
}: {
  question?: Omit<Question, "author"> & {
    author: User;
  };
  isLoading?: boolean;
}) {
  return (
    <div className="p-[1em] bordered-card flex flex-col gap-2 items-start">
      <div className="flex items-center gap-2 pb-2 border-b-2 border-solid border-foreground/10">
        <UserImage
          user={question?.author}
          className="w-[30px]"
          isLoading={isLoading}
        />
        {isLoading ? (
          <Skeleton className="h-6 w-28" />
        ) : (
          <div className="font-montserrat font-medium">
            {question?.author?.name}
          </div>
        )}
        {isLoading ? (
          <Skeleton className="h-6 w-20" />
        ) : (
          <div className="flex items-center gap-1 text-xs opacity-50">
            <CalendarDays className="w-3" />
            {dayjs(question?.createdAt).format("MMM D, YYYY")}
          </div>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-7 w-2/3" />
      ) : (
        <div className="font-semibold text-base md:text-xl leading-tight">
          {question?.title}
        </div>
      )}
      {isLoading ? (
        <>
          <Skeleton className="h-6 w-full rounded-xl" />
          <Skeleton className="h-6 w-full rounded-xl" />
          <Skeleton className="h-6 w-full rounded-xl" />
        </>
      ) : (
        <>
          {question?.description && (
            <TextEditorContent content={question?.description} />
          )}
        </>
      )}

      <div className="flex mt-1">
        <div className="text-xs flex gap-2 bordered-card py-1 px-2 font-semibold">
          <MessageSquare size={16} />
          {isLoading ? (
            <Skeleton className="h-[15px] w-[80px]" />
          ) : (
            <>{question?.answers?.length || "No"} Answers</>
          )}
        </div>
      </div>
    </div>
  );
}
