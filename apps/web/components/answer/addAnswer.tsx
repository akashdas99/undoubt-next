"use client";
import { isEmpty } from "@/lib/functions";
import { useProfile } from "@/lib/queries/user";
import { FilePenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import AnswerForm from "./answerForm";

export default function AddAnswer() {
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const { data: user, isFetching } = useProfile();
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
        <div className="flex grow items-center justify-center">
          <div className="bordered-card w-full p-md">
            <h1 className={`mb-xs font-display text-display`}>Add Answer</h1>
            <AnswerForm closeAnswerForm={() => setShowEditor(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
export const AddAnswerSkeleton = () => {
  return <Skeleton className="h-2xl w-3xl rounded-md" />;
};
