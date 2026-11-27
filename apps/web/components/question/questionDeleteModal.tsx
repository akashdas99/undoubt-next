"use client";

import { deleteRequest } from "@/lib/api/form";
import { parseFormErrors } from "@/lib/api/formErrors";
import { questionEndpoints } from "@/lib/domain/endpoints";
import { useUpdateQuestionCache } from "@/lib/queries/questions";
import { useUIStoreSelector } from "@/store/useUIStore";
import { ConfirmationModal } from "@workspace/ui/components/confirmationModal";
import { useRouter } from "next/navigation";

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

  const handleDeleteConfirm = async () => {
    const questionId = deleteModal?.questionId;
    if (!questionId) return;

    setDeleteLoading(true);

    const { error } = await deleteRequest(questionEndpoints.delete(questionId));

    setDeleteLoading(false);

    if (error) {
      const errors = parseFormErrors(error);
      setDeleteError(errors.id?.message ?? errors.root?.message ?? "");
      return;
    }

    removeQuestion(questionId);
    closeDeleteModal();

    if (redirectOnDelete) {
      router.push("/");
    }
    router.refresh();
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
