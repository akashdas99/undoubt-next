"use client";

import { addQuestionAction, editQuestionAction } from "@/actions/question";
import { FormEditor, FormInput } from "@/components/ui/form";
import { useUpdateQuestionCache } from "@/lib/queries/questions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { ConfirmationModal } from "@workspace/ui/components/confirmationModal";
import { FieldError, FieldGroup } from "@workspace/ui/components/field";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  EditQuestionSchema,
  EditQuestionType,
  QuestionSchema,
  QuestionType,
} from "@workspace/validations/question";
import { useRouter } from "next/navigation";
import {
  startTransition,
  useActionState,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";

type EditableQuestion = {
  id: string;
  title: string;
  description: string;
  slug: string;
};

export default function QuestionForm({
  question,
}: {
  question?: EditableQuestion;
}) {
  const router = useRouter();
  const { updateQuestion } = useUpdateQuestionCache();
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const shouldResetRef = useRef(false);
  const questionHref = question ? `/question/${question.slug}` : "/";

  const [res, submitQuestion, isSubmitting] = useActionState(
    async (_: unknown, data: QuestionType | EditQuestionType) => {
      if (!question) return addQuestionAction(data as QuestionType);

      const res = await editQuestionAction(data as EditQuestionType);
      if (res?.success) {
        updateQuestion(question.id, {
          title: data.title,
          description: data.description ?? "",
        });
        shouldResetRef.current = true;
        router.replace(questionHref);
      }
      return res;
    },
    { errors: {}, success: false }
  );

  const form = useForm<QuestionType | EditQuestionType>({
    resolver: zodResolver(question ? EditQuestionSchema : QuestionSchema),
    defaultValues: question
      ? {
          id: question.id,
          title: question.title,
          description: question.description || "",
        }
      : { title: "", description: "" },
    errors: ("errors" in res && res?.errors) || undefined,
  });
  const { isDirty } = form.formState;

  useLayoutEffect(
    () => () => {
      setIsDiscardOpen(false);
      if (shouldResetRef.current) {
        shouldResetRef.current = false;
        form.reset(form.getValues());
      }
    },
    [form]
  );

  useEffect(() => {
    if (!isDirty) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) =>
      event.preventDefault();
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty]);

  const onSubmit = (values: QuestionType | EditQuestionType) => {
    startTransition(() => submitQuestion(values));
  };

  const leave = () => {
    setIsDiscardOpen(false);
    form.reset();
    router.replace(questionHref);
  };

  const onCancel = () => {
    if (isDirty) setIsDiscardOpen(true);
    else leave();
  };

  return (
    <div className="mx-auto my-xl w-full max-w-content px-xl">
      <div className="bordered-card p-2xl">
        <h1 className="mb-xs font-display text-display">
          {question ? "Edit Question" : "Add Question"}
        </h1>
        <form id="question-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormInput
              control={form.control}
              name="title"
              label="Title"
              placeholder="Please enter a title for your question"
            />
            <FormEditor
              control={form.control}
              name="description"
              label="Description"
            />
          </FieldGroup>
          <FieldError errors={[form.formState.errors.root]} />
          <div className="mt-xs flex flex-col flex-wrap gap-x-xs sm:flex-row">
            <Button type="submit" className="mt-sm" loading={isSubmitting}>
              {question ? "Save Changes" : "Add Question"}
            </Button>
            {question && (
              <Button
                type="button"
                variant="outline"
                className="mt-sm"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
      {question && (
        <ConfirmationModal
          open={isDiscardOpen}
          onOpenChange={setIsDiscardOpen}
          onConfirm={leave}
          title="Discard changes?"
          description="Your edits to this question will be lost."
          confirmText="Discard"
          cancelText="Keep editing"
        />
      )}
    </div>
  );
}

export function QuestionFormSkeleton() {
  return (
    <div className="mx-auto my-xl w-full max-w-content px-xl">
      <div className="bordered-card space-y-md p-2xl">
        <Skeleton className="h-2xl w-1/3" />
        <Skeleton className="h-xl w-full" />
        <Skeleton className="h-3xl w-full" />
        <Skeleton className="h-xl w-1/4" />
      </div>
    </div>
  );
}
