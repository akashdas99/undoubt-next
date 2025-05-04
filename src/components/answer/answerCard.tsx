import { Answer } from "@/models/answer";
import { User } from "@/models/user";
import dayjs from "dayjs";
import { CalendarDays } from "lucide-react";
import TextEditorContent from "../ui/textEditorContent";
import UserImage from "../ui/userImage";
import { Skeleton } from "../ui/skeleton";

const AnswerCard = ({
  answer,
  isLoading = false,
}: {
  answer?: Omit<Answer, "author"> & {
    author: User;
  };
  isLoading?: boolean;
}) => {
  return (
    <div className="pt-[1em] flex flex-col gap-2 border-t-2 border-solid border-foreground/20">
      <div className="flex items-center gap-2">
        <UserImage
          user={answer?.author}
          className="w-[30px]"
          isLoading={isLoading}
        />
        {isLoading ? (
          <Skeleton className="h-6 w-28" />
        ) : (
          <div className="font-montserrat font-medium">
            {answer?.author?.name}
          </div>
        )}
        {isLoading ? (
          <Skeleton className="h-6 w-20" />
        ) : (
          <div className="flex items-center gap-1 text-xs opacity-50">
            <CalendarDays className="w-3" />
            {dayjs(answer?.createdAt).format("MMM D, YYYY")}
          </div>
        )}
      </div>
      {isLoading ? (
        <>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </>
      ) : (
        <>
          {answer?.description && (
            <TextEditorContent content={answer?.description} />
          )}
        </>
      )}
    </div>
  );
};

export default AnswerCard;
