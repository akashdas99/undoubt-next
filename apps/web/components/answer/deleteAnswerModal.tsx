"use client";

import { useState } from "react";
import { ConfirmationModal } from "@workspace/ui/components/confirmationModal";
import { Button } from "@workspace/ui/components/button";
import { Trash } from "lucide-react";

export default function DeleteAnswerModal({
  error,
  isDeleting,
  onDelete,
}: {
  error: string;
  isDeleting: boolean;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20"
        aria-label="Delete answer"
        onClick={() => setOpen(true)}
      >
        <Trash size={16} />
      </Button>
      <ConfirmationModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={onDelete}
        title="Delete Answer?"
        description="This action cannot be undone. This will permanently delete your answer."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        error={error}
      />
    </>
  );
}
