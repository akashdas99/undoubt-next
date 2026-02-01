"use client";

import { Question } from "@/lib/queries/questions";
import { useProfile } from "@/lib/queries/user";
import { useUIStoreSelector } from "@/store/useUIStore";
import dayjs from "dayjs";
import { CalendarDays, MessageSquare, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import TextEditorContent from "../ui/textEditorContent";
import UserImage from "../ui/userImage";
import QuestionForm from "./questionForm";
import QuestionVoteButton from "./questionVoteButton";

type QuestionCardProps = {
  question: Question;
};

// Conditional wrapper component for Link
const ConditionalLink = ({
  condition,
  href,
  children,
}: {
  condition: boolean;
  href: string;
  children: React.ReactNode;
}) => {
  return condition ? (
    <Link href={href}>{children}</Link>
  ) : (
    <div>{children}</div>
  );
};

const QuestionCard = React.memo(
  ({ question }: QuestionCardProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { data: user, isLoading } = useProfile();
    const pathname = usePathname();
    const isAuthor = !isLoading && question?.authorId === user?.id;
    const isQuestionPage = pathname.startsWith("/question/");

    const { openDeleteModal } = useUIStoreSelector("openDeleteModal");
    return (
      <div className="p-5 bordered-card flex flex-col gap-3 items-start">
        <div className="flex items-center justify-between w-full">
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
            <div className="flex items-center gap-2">
              <Button
                variant={"ghost"}
                size="icon-sm"
                className="group hover:bg-primary"
                onClick={() => {
                  setIsEditing(!isEditing);
                }}
              >
                <Pencil
                  size={16}
                  className="group-hover:text-background text-foreground"
                />
              </Button>
              <Button
                variant={"ghost"}
                size="icon-sm"
                className="group hover:bg-destructive"
                onClick={() => openDeleteModal(question.id)}
              >
                <Trash
                  size={16}
                  className="group-hover:text-background text-destructive"
                />
              </Button>
            </div>
          )}
        </div>
        <hr className="w-full border-t border-gray-300" />
        <>
          {isEditing ? (
            <QuestionForm
              question={question}
              closeQuestionForm={() => setIsEditing(false)}
            />
          ) : (
            <>
              <ConditionalLink
                condition={!isQuestionPage}
                href={`/question/${question?.slug}`}
              >
                <div className="font-semibold text-base md:text-xl leading-tight">
                  {question?.title}
                </div>
                <>
                  {question?.description && (
                    <TextEditorContent content={question?.description} />
                  )}
                </>
              </ConditionalLink>
              <hr className="w-full border-t border-gray-300" />

              <div className="flex items-center justify-between w-full text-xs pr-2">
                <div className="flex gap-2 text-muted-foreground font-semibold">
                  <MessageSquare size={16} />
                  <>{question?.answersCount || "No"} Answers</>
                </div>
                <QuestionVoteButton
                  questionId={question?.id}
                  likes={question?.likes ?? 0}
                  dislikes={question?.dislikes ?? 0}
                />
              </div>
            </>
          )}
        </>
      </div>
    );
  },
  // Custom comparison function for React.memo
  // Only re-render if the question data actually changed, not just the reference
  (prevProps: QuestionCardProps, nextProps: QuestionCardProps) => {
    const prev = prevProps.question;
    const next = nextProps.question;

    // Compare all relevant fields
    return (
      prev.id === next.id &&
      prev.title === next.title &&
      prev.description === next.description &&
      prev.slug === next.slug &&
      prev.likes === next.likes &&
      prev.dislikes === next.dislikes &&
      prev.answersCount === next.answersCount &&
      prev.createdAt === next.createdAt &&
      prev.authorId === next.authorId &&
      prev.author?.name === next.author?.name &&
      prev.author?.profilePicture === next.author?.profilePicture
    );
  },
);

QuestionCard.displayName = "QuestionCard";

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
