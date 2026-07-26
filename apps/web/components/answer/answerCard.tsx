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
    <div className="flex flex-col gap-2 border-t-2 border-solid border-foreground/20 pt-[1em]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserImage user={answer?.author} className="w-[30px]" />
          <div className="font-montserrat font-medium">
            {answer?.author?.name}
          </div>
          <div className="flex items-center gap-1 text-xs opacity-50">
            <CalendarDays className="w-3" />
            {dayjs(answer?.createdAt).format("MMM D, YYYY")}
          </div>
        </div>
        {isAuthor && (
          <div className="flex items-center gap-2">
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
    <div className="flex flex-col gap-2 border-t-2 border-solid border-foreground/20 pt-[1em]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-[30px] w-[30px] rounded-full" />
          <Skeleton className="h-6 w-28" />
          <div className="flex items-center gap-1 text-xs opacity-50">
            <CalendarDays className="w-3" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
    </div>
  );
};
