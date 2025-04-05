"use client";
import useTiptapEditor from "@/hooks/useTiptapEditor";
import { Answer } from "@/models/answer";
import { User } from "@/models/user";
import { EditorContent } from "@tiptap/react";
import dayjs from "dayjs";
import { CalendarDays, CircleUserRound } from "lucide-react";
import UserImage from "../ui/userImage";

const AnswerCard = ({
  answer,
}: {
  answer: Omit<Answer, "author"> & {
    author: User;
  };
}) => {
  const editor = useTiptapEditor({
    content: answer?.description,
    editable: false,
    className: "border-0 min-h-auto",
  });
  return (
    <div className="p-[1em] bordered-card">
      <div className="flex gap-2 items-center mb-2">
        <UserImage user={answer?.author} />
        <div className="grow">
          <div className="flex text-xs opacity-50 gap-3">
            <div className="flex items-center gap-1">
              <CircleUserRound className="w-3" />
              {answer?.author?.name}
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="w-3" />
              {dayjs(answer?.createdAt).format("MMM D, YYYY")}
            </div>
          </div>
          <div>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
