"use client";

import { Answer } from "@/db/schema/answers";
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
import { Pencil } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import AnswerForm from "./answerForm";

export default function EditAnswerModal({ answer }: { answer: Answer }) {
  const actionsRef = useRef<DialogPrimitive.Root.Actions | null>(null);

  useLayoutEffect(() => () => actionsRef.current?.close(), []);

  return (
    <Dialog actionsRef={actionsRef}>
      <DialogTrigger
        render={<Button variant="ghost" size="icon" aria-label="Edit answer" />}
      >
        <Pencil size={16} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-form">
        <DialogHeader>
          <DialogTitle className="font-display font-normal">
            Edit Answer
          </DialogTitle>
          <DialogDescription className="font-sans">
            Update your answer. Saving replaces the text on this question.
          </DialogDescription>
        </DialogHeader>
        <AnswerForm
          answer={answer}
          closeAnswerForm={() => actionsRef.current?.close()}
        />
      </DialogContent>
    </Dialog>
  );
}
