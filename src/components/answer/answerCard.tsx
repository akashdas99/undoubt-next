"use client";

import { deleteAnswerAction, updateAnswerAction } from "@/actions/answer";
import { AnswerSchema, AnswerType } from "@/lib/types";
import { Answer } from "@/models/answer";
import { User } from "@/models/user";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CalendarDays, Pencil } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import TextEditorContent from "../ui/textEditorContent";
import UserImage from "../ui/userImage";
import AnswerForm from "./answerForm";
import DeleteAnswerModal from "./deleteAnswerModal";
import { useGetProfileQuery } from "@/lib/store/user/user";

export default function AnswerCard({
  answer,
}: {
  answer: Omit<Answer, "author"> & {
    author: User;
  };
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const { data: user, isLoading } = useGetProfileQuery();

  const params = useParams<{ slug: string }>();
  const isAuthor =
    !isLoading && answer?.author?._id?.toString() === user?._id?.toString();

  const form = useForm<AnswerType>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      description: answer?.description,
    },
  });
  const onSubmit = async (values: AnswerType) => {
    setLoading(true);
    const res = await updateAnswerAction(
      answer?._id as string,
      params?.slug,
      values
    );
    setLoading(false);
    if (res?.error?.type === "serverError") {
      form.setError("root", {
        message: res?.error?.message,
      });
    } else setIsEditing(false);
  };
  const onDelete = async () => {
    setIsDeleting(true);
    const res = await deleteAnswerAction(answer?._id as string, params?.slug);

    if (res?.error?.type === "serverError") {
      setDeleteError(res?.error?.message);
      setIsDeleting(false);
    } else setIsEditing(false);
  };
  useEffect(() => {
    if (!isEditing) form.reset();
  }, [isEditing, form]);
  return (
    <div className="pt-[1em] flex flex-col gap-2 border-t-2 border-solid border-foreground/20">
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
              size={"sm-icon"}
              className="group"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil
                size={20}
                className="group-hover:text-background text-foreground"
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
            form={form}
            name="description"
            onSubmit={onSubmit}
            isLoading={loading}
            onCancel={() => setIsEditing(false)}
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
    <div className="pt-[1em] flex flex-col gap-2 border-t-2 border-solid border-foreground/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="rounded-full h-[30px] w-[30px]" />
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
