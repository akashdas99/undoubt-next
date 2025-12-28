"use client";

import dayjs from "dayjs";
import { CalendarDays, MessageSquare, Pencil } from "lucide-react";
import React, { ReactNode, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import TextEditorContent from "../ui/textEditorContent";
import UserImage from "../ui/userImage";
import DeleteQuestionModal from "./deleteQuestionModal";
import { deleteQuestionAction } from "@/actions/question";
import { useGetProfileQuery } from "@/lib/store/user/user";
import { Button } from "../ui/button";
import QuestionForm from "./questionForm";
import Link from "next/link";
import QuestionVoteButton from "./questionVoteButton";
import { Question } from "@/lib/store/questions/question";

type QuestionCardProps = {
  question: Question;
  asLink?: boolean;
};

const QuestionCard = ({ question, asLink }: QuestionCardProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const { data: user, isLoading } = useGetProfileQuery();

  const isAuthor = !isLoading && question?.authorId === user?.id;

  const onDelete = async () => {
    setIsDeleting(true);
    const res = await deleteQuestionAction({ id: question.id });

    if (!res?.success) {
      setDeleteError(("errors" in res && res?.errors?.id?.message) || "");
      setIsDeleting(false);
    }
  };
  return (
    <Wrapper asLink={asLink && !isEditing} href={"question/" + question?.slug}>
      <div className="p-[1em] bordered-card flex flex-col gap-2 items-start">
        <div className="flex items-center justify-between pb-2 border-b-2 border-solid border-foreground/10 w-full">
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
          {isAuthor && (
            <div
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Button
                variant={"ghost"}
                size={"sm-icon"}
                className="group"
                onClick={() => {
                  setIsEditing(!isEditing);
                }}
              >
                <Pencil
                  size={20}
                  className="group-hover:text-background text-foreground"
                />
              </Button>
              <DeleteQuestionModal
                error={deleteError}
                isDeleting={isDeleting}
                onDelete={onDelete}
              />
            </div>
          )}
        </div>

        <>
          {isEditing ? (
            <QuestionForm
              question={question}
              closeQuestionForm={() => setIsEditing(false)}
            />
          ) : (
            <>
              <div className="font-semibold text-base md:text-xl leading-tight">
                {question?.title}
              </div>
              <>
                {question?.description && (
                  <TextEditorContent content={question?.description} />
                )}
              </>

              <div className="flex items-center justify-between mt-1 w-full">
                <div className="text-xs flex gap-2 py-1 px-2 font-semibold">
                  <MessageSquare size={16} />
                  <>{question?.answersCount || "No"} Answers</>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <QuestionVoteButton
                    questionId={question.id}
                    initialLikes={question.likes}
                    initialDislikes={question.dislikes}
                  />
                </div>
              </div>
            </>
          )}
        </>
      </div>
    </Wrapper>
  );
};
const Wrapper = ({
  asLink = false,
  href,
  children,
}: {
  asLink?: boolean;
  href: string;
  children: ReactNode;
}) => {
  if (asLink) {
    return <Link href={href}>{children}</Link>;
  }
  return <div>{children}</div>;
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
