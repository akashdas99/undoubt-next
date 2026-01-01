"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  error?: string;
}

export function ConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  error,
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-righteous font-normal">
            {title}
          </DialogTitle>
          <DialogDescription className="font-montserrat">
            {description}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="text-xs text-destructive font-medium">{error}</p>
        )}
        <DialogFooter className="font-montserrat">
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmText}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              {cancelText}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
