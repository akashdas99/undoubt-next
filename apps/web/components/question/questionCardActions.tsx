"use client";

import { Question } from "@/lib/queries/questions";
import { useProfile } from "@/lib/queries/user";
import { useUIStoreSelector } from "@/store/useUIStore";
import { Button } from "@workspace/ui/components/button";
import { CardAction } from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";

export default function QuestionCardActions({
  question,
}: {
  question: Pick<Question, "id" | "authorId" | "slug">;
}) {
  const { data: user, isLoading } = useProfile();
  const isAuthor = !isLoading && question.authorId === user?.id;
  const { openDeleteModal } = useUIStoreSelector("openDeleteModal");

  if (!isAuthor) return null;

  return (
    <CardAction className="relative z-10 -mr-xs ml-auto self-start">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Question actions"
            />
          }
        >
          <MoreHorizontal size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={4}
          className="w-auto min-w-32"
        >
          <DropdownMenuItem
            render={<Link href={`/question/${question.slug}/edit`} />}
          >
            <Pencil /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => openDeleteModal(question.id)}
          >
            <Trash /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardAction>
  );
}
