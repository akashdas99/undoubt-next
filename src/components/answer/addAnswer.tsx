"use client";
import { isEmpty } from "@/lib/functions";
import { useGetProfileQuery } from "@/lib/store/user/user";
import { FilePenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import AnswerForm from "./answerForm";

export default function AddAnswer() {
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const { data: user, isFetching } = useGetProfileQuery();
  const isLoggedIn = !isEmpty(user);
  const router = useRouter();

  // Close editor when user logs out
  const isEditorOpen = showEditor && isLoggedIn;

  return (
    <div className="flex items-center justify-start">
      {isFetching ? (
        <AddAnswerSkeleton />
      ) : !isEditorOpen ? (
        <Button
          type="button"
          variant={"default"}
          size={"lg"}
          onClick={() =>
            isLoggedIn ? setShowEditor(true) : router.push("/login")
          }
        >
          <FilePenLine /> {isLoggedIn ? "Answer" : "Login"}
        </Button>
      ) : (
        <div className="flex items-center justify-center grow">
          <div className="bordered-card p-8 rounded-xl  w-full">
            <h1 className={`font-righteous text-3xl mb-6`}>Add Answer</h1>
            <AnswerForm closeAnswerForm={() => setShowEditor(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
export const AddAnswerSkeleton = () => {
  return <Skeleton className="h-10 w-[150px] rounded-md" />;
};
