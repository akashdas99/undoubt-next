import { Question } from "@/models/question";
import { User } from "@/models/user";
import dayjs from "dayjs";
import { CalendarDays, CircleUserRound } from "lucide-react";
import UserImage from "../ui/userImage";

const QuestionCard = ({
  question,
}: {
  question: Omit<Question, "author"> & {
    author: User;
  };
}) => {
  return (
    <div className="p-[1em] neo">
      <div className="flex gap-2 items-center mb-2">
        <UserImage user={question?.author} />
        <div>
          <div className="text-primary font-semibold text-lg">
            {question?.title}
          </div>
          <div className="flex text-xs opacity-50 gap-3">
            <div className="flex items-center gap-1">
              <CircleUserRound className="w-3" />
              {question?.author?.name}
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="w-3" />
              {dayjs(question?.createdAt).format("MMM D, YYYY")}
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs">{question?.answers?.length || "No"} Answers</div>
    </div>
  );
};

export default QuestionCard;
