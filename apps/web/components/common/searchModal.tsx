import { Search } from "lucide-react";
import { useState } from "react";
import QuestionSearch from "../question/questionSearch";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function SearchModal() {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Search />
      </DialogTrigger>
      <DialogContent
        className="w-10/12 sm:max-w-[425px]"
        showCloseButton={false}
      >
        <DialogTitle>Search</DialogTitle>
        <QuestionSearch onClick={() => handleOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
