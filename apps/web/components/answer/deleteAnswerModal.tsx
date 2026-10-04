import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
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
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="group hover:bg-destructive"
          />
        }
      >
        <Trash
          size={20}
          className="text-destructive group-hover:text-background"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display font-normal">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription className="font-sans">
            This action cannot be undone. This will permanently delete your
            answer.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="text-xs font-medium text-destructive">{error}</p>
        )}
        <DialogFooter className="font-sans">
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            loading={isDeleting}
          >
            Delete
          </Button>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
