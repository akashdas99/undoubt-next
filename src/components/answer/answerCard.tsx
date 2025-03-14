"use client";
import { Answer } from "@/models/answer";
import { User } from "@/models/user";
import dayjs from "dayjs";
import { CalendarDays, CircleUserRound } from "lucide-react";
import UserImage from "../ui/userImage";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const AnswerCard = ({
  answer,
}: {
  answer: Omit<Answer, "author"> & {
    author: User;
  };
}) => {
  return (
    <div className="p-[1em] neo">
      <div className="flex gap-2 items-center mb-2">
        <UserImage name={answer?.author?.name} />
        <div>
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
            <EditorProvider
              extensions={[StarterKit.configure()]}
              content={answer?.description}
              immediatelyRender={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
