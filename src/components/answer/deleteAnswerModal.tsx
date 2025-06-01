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
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm-icon"}
          className="group hover:bg-destructive"
        >
          <Trash
            size={20}
            className="group-hover:text-background text-destructive"
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            answer.
            {error && (
              <p className="text-[0.6rem] text-destructive font-medium">
                {error}
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
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
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
