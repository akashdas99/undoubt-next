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
          className="group-hover:text-background text-destructive"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-righteous font-normal">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription className="font-montserrat">
            This action cannot be undone. This will permanently delete your
            answer.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="text-[0.6rem] text-destructive font-medium">{error}</p>
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
          <DialogClose render={<Button type="button" variant="outline" />}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
