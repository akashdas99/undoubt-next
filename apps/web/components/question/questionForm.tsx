"use client";
import { addQuestionAction, editQuestionAction } from "@/actions/question";
import { FieldGroup } from "@/components/ui/field";
import { isEmpty } from "@/lib/functions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditQuestionSchema,
  EditQuestionType,
  QuestionSchema,
  QuestionType,
} from "@repo/validations/question";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { FormEditor, FormInput } from "../ui/form";

export default function QuestionForm({
  closeQuestionForm,
  question,
}: {
  closeQuestionForm: () => void;
  question?: {
    id: string;
    title: string;
    description: string;
  };
}) {
  const [res, handleQuestionSubmit, isSubmittingQuestion] = useActionState(
    async (_: unknown, questionData: QuestionType | EditQuestionType) => {
      const res = await (question
        ? editQuestionAction(questionData as EditQuestionType)
        : addQuestionAction(questionData as QuestionType));

      if (!isEmpty(res) && "success" in res && res?.success) {
        closeQuestionForm();
      }
      return res;
    },
    { errors: {}, success: false },
  );

  const form = useForm<EditQuestionType | QuestionType>({
    resolver: zodResolver(question ? EditQuestionSchema : QuestionSchema),
    defaultValues: question
      ? {
          id: question.id,
          title: question.title,
          description: question.description || "",
        }
      : {
          title: "",
          description: "",
        },
    errors: ("errors" in res && res?.errors) || undefined,
  });

  const onSubmit = (values: QuestionType | EditQuestionType) => {
    startTransition(() => handleQuestionSubmit(values));
  };

  const onClose = () => {
    closeQuestionForm();
    form.reset();
  };

  return (
    <div className="w-full">
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
        {form?.formState?.errors?.root?.message && (
          <p className="text-[0.6rem] text-destructive font-medium">
            {form?.formState?.errors?.root?.message}
          </p>
        )}
        <div className="flex flex-wrap gap-x-2 mt-2 flex-col sm:flex-row">
          <Button type="submit" className="mt-3" loading={isSubmittingQuestion}>
            {question ? "Save Changes" : "Add Question"}
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="mt-3"
            variant={"outline"}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
