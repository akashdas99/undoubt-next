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
          <div className="bordered-card w-full rounded-xl p-8">
            <h1 className={`mb-6 font-righteous text-3xl`}>Add Answer</h1>
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
