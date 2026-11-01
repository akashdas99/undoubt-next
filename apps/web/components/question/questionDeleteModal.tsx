"use client";

import { deleteQuestionAction } from "@/actions/question";
import { useUpdateQuestionCache } from "@/lib/queries/questions";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@workspace/ui/components/confirmationModal";
import { useUIStoreSelector } from "@/store/useUIStore";
import { startTransition } from "react";

type QuestionDeleteModalProps = {
  redirectOnDelete?: boolean;
};

export default function QuestionDeleteModal({
  redirectOnDelete = false,
}: QuestionDeleteModalProps) {
  const { removeQuestion } = useUpdateQuestionCache();
  const { deleteModal, setDeleteLoading, closeDeleteModal, setDeleteError } =
    useUIStoreSelector(
      "deleteModal",
      "setDeleteLoading",
      "setDeleteError",
      "closeDeleteModal"
    );
  const router = useRouter();

  const handleDeleteConfirm = () => {
    const questionId = deleteModal?.questionId;
    if (!questionId) return;

    setDeleteLoading(true);

    startTransition(async () => {
      const res = await deleteQuestionAction({ id: questionId }, false);

      setDeleteLoading(false);

      if (!res?.success) {
        setDeleteError(("errors" in res && res?.errors?.id?.message) || "");
        return;
      }

      removeQuestion(questionId);
      closeDeleteModal();

      if (redirectOnDelete) {
        router.push("/");
      }
    });
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
