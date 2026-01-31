"use client";

import { deleteQuestionAction } from "@/actions/question";
import { PaginatedResponse } from "@/lib/queries/questions";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "../ui/confirmationModal";
import { useUIStoreSelector } from "@/store/useUIStore";

type QuestionDeleteModalProps = {
  redirectOnDelete?: boolean;
};

export default function QuestionDeleteModal({
  redirectOnDelete = false,
}: QuestionDeleteModalProps) {
  const queryClient = useQueryClient();
  const { deleteModal, setDeleteLoading, closeDeleteModal, setDeleteError } =
    useUIStoreSelector(
      "deleteModal",
      "setDeleteLoading",
      "setDeleteError",
      "closeDeleteModal",
    );
  const router = useRouter();

  const handleDeleteConfirm = async () => {
    if (!deleteModal?.questionId) return;

    setDeleteLoading(true);

    const res = await deleteQuestionAction(
      { id: deleteModal.questionId },
      false,
    );

    setDeleteLoading(false);

    if (!res?.success) {
      setDeleteError(("errors" in res && res?.errors?.id?.message) || "");
    } else {
      // Remove deleted question from React Query cache
      queryClient.setQueriesData<{
        pages: PaginatedResponse[];
        pageParams: number[];
      }>({ queryKey: ["questions", "list"] }, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data?.filter((q) => q.id !== deleteModal.questionId),
          })),
        };
      });
      closeDeleteModal();

      if (redirectOnDelete) {
        router.push("/");
      }
    }
  };

  return (
    <ConfirmationModal
      open={deleteModal.isOpen}
      onOpenChange={(open) => {
        if (!open) closeDeleteModal();
      }}
      onConfirm={handleDeleteConfirm}
      title="Delete Question?"
      description="This action cannot be undone. This will permanently delete your question and all its answers."
      confirmText="Delete"
      cancelText="Cancel"
      isLoading={deleteModal.isDeleting}
      error={deleteModal.error}
    />
  );
}
