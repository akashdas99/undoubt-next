"use client";

import { deleteAnswerAction } from "@/actions/answer";
import { useProfile } from "@/lib/queries/user";

import dayjs from "dayjs";
import { CalendarDays, Pencil } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import TextEditorContent from "../ui/textEditorContent";
import AnswerForm from "./answerForm";
import DeleteAnswerModal from "./deleteAnswerModal";
import { Answer } from "@/db/schema/answers";
import UserImage from "../ui/userImage";

export default function AnswerCard({
  answer,
}: {
  answer: Answer & {
    author: {
      name: string;
      profilePicture: string | null;
    };
  };
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const { data: user, isLoading } = useProfile();

  const params = useParams<{ slug: string }>();
  const isAuthor = !isLoading && answer?.authorId === user?.id;

  const onDelete = async () => {
    setIsDeleting(true);
    const res = await deleteAnswerAction(answer?.id as string, params?.slug);

    if (!res?.success) {
      setDeleteError(("errors" in res && res?.errors?.root?.message) || "");
      setIsDeleting(false);
    } else setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-xs border-t-2 border-solid border-foreground/20 pt-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-xs">
          <UserImage user={answer?.author} className="w-2xl" />
          <div className="font-sans font-medium">{answer?.author?.name}</div>
          <div className="flex items-center gap-xxs text-xs opacity-50">
            <CalendarDays className="w-sm" />
            {dayjs(answer?.createdAt).format("MMM D, YYYY")}
          </div>
        </div>
        {isAuthor && (
          <div className="flex items-center gap-xs">
            <Button
              variant={"ghost"}
              size="icon-sm"
              className="group hover:bg-primary"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil
                size={20}
                className="text-foreground group-hover:text-background"
              />
            </Button>

            <DeleteAnswerModal
              error={deleteError}
              isDeleting={isDeleting}
              onDelete={onDelete}
            />
          </div>
        )}
      </div>
      <>
        {isEditing ? (
          <AnswerForm
            answer={answer}
            closeAnswerForm={() => setIsEditing(false)}
          />
        ) : (
          <>
            {answer?.description && (
              <TextEditorContent content={answer?.description} />
            )}
          </>
        )}
      </>
    </div>
  );
}

export const AnswerCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-xs border-t-2 border-solid border-foreground/20 pt-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-xs">
          <Skeleton className="size-2xl rounded-full" />
          <Skeleton className="h-xl w-3xl" />
          <div className="flex items-center gap-xxs text-xs opacity-50">
            <CalendarDays className="w-sm" />
            <Skeleton className="h-md w-3xl" />
          </div>
        </div>
      </div>
      <Skeleton className="h-xl w-full" />
      <Skeleton className="h-xl w-full" />
      <Skeleton className="h-xl w-full" />
    </div>
  );
};
