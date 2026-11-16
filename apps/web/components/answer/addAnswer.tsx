"use client";
import { isEmpty } from "@/lib/functions";
import { useProfile } from "@/lib/queries/user";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { FilePenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import AnswerForm from "./answerForm";

export default function AddAnswer() {
  const actionsRef = useRef<DialogPrimitive.Root.Actions | null>(null);
  const [formKey, setFormKey] = useState(0);
  const { data: user, isFetching } = useProfile();
  const isLoggedIn = !isEmpty(user);
  const router = useRouter();

  useLayoutEffect(() => () => actionsRef.current?.close(), []);

  useLayoutEffect(() => {
    if (!isLoggedIn) actionsRef.current?.close();
  }, [isLoggedIn]);

  if (isFetching) return <AddAnswerSkeleton />;

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-start">
        <Button
          type="button"
          variant="default"
          size="lg"
          onClick={() => router.push("/login")}
        >
          <FilePenLine /> Login
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-start">
      <Dialog
        actionsRef={actionsRef}
        onOpenChangeComplete={(open) => {
          if (!open) setFormKey((key) => key + 1);
        }}
      >
        <DialogTrigger
          render={<Button type="button" variant="default" size="lg" />}
        >
          <FilePenLine /> Answer
        </DialogTrigger>
        <DialogContent className="sm:max-w-form">
          <DialogHeader>
            <DialogTitle className="font-display font-normal">
              Add Answer
            </DialogTitle>
            <DialogDescription className="font-sans">
              Write your answer. It will show on this question.
            </DialogDescription>
          </DialogHeader>
          <AnswerForm
            key={formKey}
            closeAnswerForm={() => actionsRef.current?.close()}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const AddAnswerSkeleton = () => {
  return <Skeleton className="h-2xl w-3xl rounded-md" />;
};
