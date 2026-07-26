"use client";

import { addQuestionAction } from "@/actions/question";
import { FieldGroup } from "@workspace/ui/components/field";
import { FormEditor, FormInput } from "@/components/ui/form";
import { QuestionSchema, QuestionType } from "@workspace/validations/question";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@workspace/ui/components/button";

export default function AddQuestion() {
  const [res, handleAddQuestion, isAddingQuestion] = useActionState(
    async (_: unknown, data: QuestionType) => {
      const res = await addQuestionAction(data);
      return res;
    },
    { errors: {}, success: false }
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
    <div className="my-3 w-full max-w-screen-lg px-3 md:my-8">
      <div className="bordered-card p-[1em]">
        <h1 className={`mb-2 font-righteous text-xl md:text-3xl`}>
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
            <p className="text-[0.6rem] font-medium text-destructive">
              {form?.formState?.errors?.root?.message}
            </p>
          )}
          <div className="mt-2 flex flex-col flex-wrap gap-x-2 sm:flex-row">
            <Button type="submit" className="mt-3" loading={isAddingQuestion}>
              Add Question
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
