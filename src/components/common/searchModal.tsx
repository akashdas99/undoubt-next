import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import QuestionSearch from "../question/questionSearch";

export default function SearchModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-10/12 sm:max-w-[425px] p-0" hideClose>
        <DialogTrigger asChild>
          <QuestionSearch />
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}
