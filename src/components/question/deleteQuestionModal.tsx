"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { ConfirmationModal } from "../ui/confirmationModal";

export default function DeleteQuestionModal({
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
        variant={"ghost"}
        size={"sm-icon"}
        className="group hover:bg-destructive"
        onClick={() => setOpen(true)}
      >
        <Trash
          size={16}
          className="group-hover:text-background text-destructive"
        />
      </Button>
      <ConfirmationModal
        open={open}
        onOpenChange={setOpen}
        onConfirm={onDelete}
        title="Delete Question?"
        description="This action cannot be undone. This will permanently delete your question and all its answers."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        error={error}
      />
    </>
  );
}
