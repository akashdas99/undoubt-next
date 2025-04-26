import { Question } from "@/models/question";
import { User } from "@/models/user";
import dayjs from "dayjs";
import { CalendarDays, MessageSquare } from "lucide-react";
import UserImage from "../ui/userImage";
import TextEditorContent from "../ui/textEditorContent";

export default async function QuestionCard({
  question,
}: {
  question: Omit<Question, "author"> & {
    author: User;
  };
}) {
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
      {/* <div className="border-t-2 border-solid border-foreground/10"></div> */}
      <div className="font-semibold text-base md:text-xl leading-tight">
        {question?.title}
      </div>
      {question?.description && (
        <TextEditorContent content={question?.description} />
      )}
      <div className="flex mt-1">
        <div className="text-xs flex gap-2 bordered-card py-1 px-2 font-semibold">
          <MessageSquare size={16} />
          {question?.answers?.length || "No"} Answers
        </div>
      </div>
    </div>
  );
}
