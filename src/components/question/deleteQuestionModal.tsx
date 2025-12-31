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
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";

export default function DeleteQuestionModal({
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
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm-icon"}
          className="group hover:bg-destructive"
        >
          <Trash
            size={16}
            className="group-hover:text-background text-destructive"
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-righteous font-normal">
            Delete Question?
          </DialogTitle>
          <DialogDescription className="font-montserrat">
            This action cannot be undone. This will permanently delete your
            question and all its answers.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="text-xs text-destructive font-medium">{error}</p>
        )}
        <DialogFooter className="font-montserrat">
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            loading={isDeleting}
          >
            Delete
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
