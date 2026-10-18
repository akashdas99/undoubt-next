"use client";
import { Search } from "lucide-react";
import { useState } from "react";
import QuestionSearch from "../question/questionSearch";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

export default function SearchModal() {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search questions"
            className="text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted dark:hover:bg-muted"
          />
        }
      >
        <Search />
      </DialogTrigger>
      <DialogContent
        className="w-10/12 sm:max-w-dialog"
        showCloseButton={false}
      >
        <DialogTitle>Search</DialogTitle>
        <QuestionSearch onClick={() => handleOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
