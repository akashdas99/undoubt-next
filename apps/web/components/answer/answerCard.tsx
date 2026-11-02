"use client";

import { deleteAnswerAction } from "@/actions/answer";
import { formatShortDate } from "@/lib/date";
import { useProfile } from "@/lib/queries/user";

import { Answer } from "@/db/schema/answers";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { CalendarDays } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import TextEditorContent from "../ui/textEditorContent";
import UserImage from "../ui/userImage";
import DeleteAnswerModal from "./deleteAnswerModal";
import EditAnswerModal from "./editAnswerModal";

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
    }
  };

  return (
    <div className="flex flex-col gap-xs border-t-2 border-solid border-foreground/20 pt-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-xs">
          <UserImage user={answer?.author} className="w-2xl" />
          <div className="font-sans font-medium">{answer?.author?.name}</div>
          <div className="flex items-center gap-xxs text-xs opacity-50">
            <CalendarDays className="w-sm" />
            {formatShortDate(answer?.createdAt)}
          </div>
        </div>
        {isAuthor && (
          <div className="flex items-center gap-xs">
            <EditAnswerModal answer={answer} />

            <DeleteAnswerModal
              error={deleteError}
              isDeleting={isDeleting}
              onDelete={onDelete}
            />
          </div>
        )}
      </div>
      {answer?.description && (
        <TextEditorContent content={answer?.description} />
      )}
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
