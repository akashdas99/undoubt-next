"use client";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import QuestionSearch from "../question/questionSearch";

export default function SearchModal() {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label="Search questions"
            aria-keyshortcuts="Control+K Meta+K"
            className="border-border text-foreground hover:bg-white hover:text-foreground aria-expanded:bg-white aria-expanded:text-foreground md:hidden dark:hover:bg-muted dark:aria-expanded:bg-muted"
          />
        }
      >
        <Search />
      </DialogTrigger>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            aria-keyshortcuts="Control+K Meta+K"
            className="hidden gap-xs border-border text-foreground hover:bg-white hover:text-foreground aria-expanded:bg-white aria-expanded:text-foreground md:inline-flex dark:hover:bg-muted dark:aria-expanded:bg-muted"
          />
        }
      >
        <Search />
        Search
        <kbd className="pointer-events-none hidden rounded-sm border border-border bg-background px-xs py-xxs font-sans text-xs text-muted-foreground lg:inline">
          Ctrl K
        </kbd>
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
