"use client";

import { deleteRequest } from "@/lib/api/form";
import { parseFormErrors } from "@/lib/api/formErrors";
import { answerEndpoints } from "@/lib/domain/endpoints";
import { formatShortDate } from "@/lib/date";
import { useProfile } from "@/lib/queries/user";

import type { Answer } from "@workspace/db";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const { data: user, isLoading } = useProfile();
  const router = useRouter();
  const isAuthor = !isLoading && answer?.authorId === user?.id;
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const onDelete = async () => {
    setIsDeleting(true);
    setDeleteError("");
    const { error } = await deleteRequest(answerEndpoints.delete(answer.id));
    setIsDeleting(false);
    if (error) {
      const errors = parseFormErrors(error);
      setDeleteError(errors.root?.message ?? "Something went wrong");
      return;
    }
    router.refresh();
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
