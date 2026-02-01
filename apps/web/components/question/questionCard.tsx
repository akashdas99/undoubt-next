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
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
      <Card size="sm">
        <CardHeader className="flex-row items-center justify-between gap-0">
          <CardTitle className="flex items-center gap-2">
            <UserImage user={question?.author} className="w-[30px]" />
            <span className="font-montserrat font-medium">
              {question?.author?.name}
            </span>
            <span className="flex items-center gap-1 text-xs opacity-50 font-normal">
              <CalendarDays className="w-3" />
              {dayjs(question?.createdAt).format("MMM D, YYYY")}
            </span>
          </CardTitle>
          {isAuthor && (
            <CardAction className="flex items-center gap-2">
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
            </CardAction>
          )}
        </CardHeader>
        <hr className="mx-3 border-t border-gray-300" />
        <CardContent>
          {isEditing ? (
            <QuestionForm
              question={question}
              closeQuestionForm={() => setIsEditing(false)}
            />
          ) : (
            <ConditionalLink
              condition={!isQuestionPage}
              href={`/question/${question?.slug}`}
            >
              <div className="font-semibold text-base md:text-xl leading-tight">
                {question?.title}
              </div>
              {question?.description && (
                <TextEditorContent content={question?.description} />
              )}
            </ConditionalLink>
          )}
        </CardContent>
        <hr className="mx-3 border-t border-gray-300" />

        <CardFooter className="justify-between text-xs">
          <div className="flex gap-2 text-muted-foreground font-semibold">
            <MessageSquare size={16} />
            <span>{question?.answersCount || "No"} Answers</span>
          </div>
          <QuestionVoteButton
            questionId={question?.id}
            likes={question?.likes ?? 0}
            dislikes={question?.dislikes ?? 0}
          />
        </CardFooter>
      </Card>
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
    <Card size="sm">
      <CardHeader>
        <Skeleton className="rounded-full h-[30px] w-[30px]" />
        <Skeleton className="h-5 w-28" />
        <span className="flex items-center gap-1 text-xs opacity-50">
          <CalendarDays className="w-3" />
          <Skeleton className="h-4 w-20" />
        </span>
      </CardHeader>
      <hr className="mx-3 border-t border-gray-300" />
      <CardContent className="space-y-2">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </CardContent>
      <hr className="mx-3 border-t border-gray-300" />
      <CardFooter className="text-xs">
        <div className="flex gap-2 font-semibold">
          <MessageSquare size={16} />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
export { QuestionCardSkeleton };
