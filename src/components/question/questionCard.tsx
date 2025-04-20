import { Question } from "@/models/question";
import { User } from "@/models/user";
import dayjs from "dayjs";
import { CalendarDays, MessageSquare } from "lucide-react";
import UserImage from "../ui/userImage";

export default async function QuestionCard({
  question,
}: {
  question: Omit<Question, "author"> & {
    author: User;
  };
}) {
  return (
    <div className="p-[1em] bordered-card flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <UserImage user={question?.author} className="w-[30px]" />
        <div className="font-montserrat font-medium">
          {question?.author?.name}
        </div>
        <div className="flex items-center gap-1 text-xs opacity-50">
          <CalendarDays className="w-3" />
          {dayjs(question?.createdAt).format("MMM D, YYYY")}
        </div>
      </div>
      <div className="font-semibold text-sm md:text-2xl">{question?.title}</div>
      <div className="text-xs flex gap-2">
        <MessageSquare size={16} strokeWidth={0.5} />
        {question?.answers?.length || "No"} Answers
      </div>
    </div>
  );
}
