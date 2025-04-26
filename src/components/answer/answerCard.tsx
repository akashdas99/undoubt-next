import { Answer } from "@/models/answer";
import { User } from "@/models/user";
import dayjs from "dayjs";
import { CalendarDays } from "lucide-react";
import TextEditorContent from "../ui/textEditorContent";
import UserImage from "../ui/userImage";

const AnswerCard = ({
  answer,
}: {
  answer: Omit<Answer, "author"> & {
    author: User;
  };
}) => {
  return (
    <div className="pt-[1em] flex flex-col gap-2 border-t-2 border-solid border-foreground/20">
      <div className="flex items-center gap-2">
        <UserImage user={answer?.author} className="w-[30px]" />
        <div className="font-montserrat font-medium">
          {answer?.author?.name}
        </div>
        <div className="flex items-center gap-1 text-xs opacity-50">
          <CalendarDays className="w-3" />
          {dayjs(answer?.createdAt).format("MMM D, YYYY")}
        </div>
      </div>
      <TextEditorContent content={answer?.description} />
    </div>
  );
};

export default AnswerCard;
