"use client";

import { addQuestionAction } from "@/actions/question";
import { FieldGroup } from "@/components/ui/field";
import { FormEditor, FormInput } from "@/components/ui/form";
import { QuestionSchema, QuestionType } from "@repo/validations/question";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";

export default function AddQuestion() {
  const [res, handleAddQuestion, isAddingQuestion] = useActionState(
    async (_: unknown, data: QuestionType) => {
      const res = await addQuestionAction(data);
      return res;
    },
    { errors: {}, success: false },
  );

  const form = useForm<QuestionType>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: "",
      description: "",
    },
    errors: ("errors" in res && res?.errors) || undefined,
  });

  const onSubmit = (values: QuestionType) => {
    startTransition(() => handleAddQuestion(values));
  };

  return (
    <div className="w-full my-3 md:my-8 max-w-screen-lg px-3">
      <div className="bordered-card p-[1em]">
        <h1 className={`font-righteous text-xl mb-2 md:text-3xl`}>
          Add Question
        </h1>
        <form id="add-question-form" onSubmit={form.handleSubmit(onSubmit)}>
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
            <Button type="submit" className="mt-3" loading={isAddingQuestion}>
              Add Question
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
