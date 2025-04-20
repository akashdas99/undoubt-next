import { Question } from "@/models/question";
import { User } from "@/models/user";
import dayjs from "dayjs";
import { CalendarDays, CircleUserRound } from "lucide-react";
import UserImage from "../ui/userImage";

export default async function QuestionCard({
  question,
}: {
  question: Omit<Question, "author"> & {
    author: User;
  };
}) {
  return (
    <div className="p-[1em] bordered-card">
      <div className="flex gap-2 items-start mb-3">
        <UserImage user={question?.author} className="w-[26px]" />
        <div>
          <div className="text-primary font-semibold text-sm md:text-lg">
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
}
