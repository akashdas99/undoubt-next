"use client";

import { deleteQuestionAction } from "@/actions/question";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { questionApi } from "@/lib/store/questions/question";
import {
  closeDeleteModal,
  selectDeleteModal,
  setDeleteError,
  setDeleteLoading,
} from "@/lib/store/ui/deleteModalSlice";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "../ui/confirmationModal";

type QuestionDeleteModalProps = {
  redirectOnDelete?: boolean;
};

export default function QuestionDeleteModal({
  redirectOnDelete = false,
}: QuestionDeleteModalProps) {
  const dispatch = useAppDispatch();
  const deleteModal = useAppSelector(selectDeleteModal);
  const router = useRouter();

  const handleDeleteConfirm = async () => {
    if (!deleteModal.questionId) return;

    dispatch(setDeleteLoading(true));

    const res = await deleteQuestionAction(
      { id: deleteModal.questionId },
      false,
    );

    dispatch(setDeleteLoading(false));

    if (!res?.success) {
      dispatch(
        setDeleteError(("errors" in res && res?.errors?.id?.message) || ""),
      );
    } else {
      // Remove deleted question from RTK Query cache
      dispatch(
        questionApi.util.updateQueryData("getQuestions", "", (draft) => {
          draft.pages.forEach((page) => {
            if (page.data) {
              page.data = page.data.filter(
                (q) => q.id !== deleteModal.questionId,
              );
            }
          });
        }),
      );
      dispatch(closeDeleteModal());

      if (redirectOnDelete) {
        router.push("/");
      }
    }
  };

  return (
    <ConfirmationModal
      open={deleteModal.isOpen}
      onOpenChange={(open) => {
        if (!open) dispatch(closeDeleteModal());
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
