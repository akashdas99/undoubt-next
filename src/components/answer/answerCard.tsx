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

const AnswerCard = ({
  answer,
  isLoading = false,
  isAuthor = false,
}: {
  answer?: Omit<Answer, "author"> & {
    author: User;
  };
  isLoading?: boolean;
  isAuthor?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const params = useParams<{ slug: string }>();

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
    setIsDeleting(false);

    if (res?.error?.type === "serverError") {
      setDeleteError(res?.error?.message);
    } else setIsEditing(false);
  };
  useEffect(() => {
    if (!isEditing) form.reset();
  }, [isEditing, form]);
  return (
    <div className="pt-[1em] flex flex-col gap-2 border-t-2 border-solid border-foreground/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserImage
            user={answer?.author}
            className="w-[30px]"
            isLoading={isLoading}
          />
          {isLoading ? (
            <Skeleton className="h-6 w-28" />
          ) : (
            <div className="font-montserrat font-medium">
              {answer?.author?.name}
            </div>
          )}
          {isLoading ? (
            <Skeleton className="h-6 w-20" />
          ) : (
            <div className="flex items-center gap-1 text-xs opacity-50">
              <CalendarDays className="w-3" />
              {dayjs(answer?.createdAt).format("MMM D, YYYY")}
            </div>
          )}
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
      {isLoading ? (
        <>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </>
      ) : (
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
      )}
    </div>
  );
};

export default AnswerCard;
