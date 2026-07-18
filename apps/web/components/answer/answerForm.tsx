"use client";
import { addAnswerAction, updateAnswerAction } from "@/actions/answer";
import { FieldGroup } from "@/components/ui/field";
import { isEmpty } from "@/lib/functions";

import { Answer } from "@/db/schema/answers";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnswerSchema, AnswerType } from "@workspace/validations/answer";
import { useParams } from "next/navigation";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { FormEditor } from "../ui/form";

export default function AnswerForm({
  closeAnswerForm,
  answer,
}: {
  closeAnswerForm: () => void;
  answer?: Answer;
}) {
  const params = useParams<{ slug: string }>();

  const [res, handleAddAnswer, isAddingAnswer] = useActionState(
    async (_: unknown, userData: AnswerType) => {
      const res = await (answer
        ? updateAnswerAction(answer?.id, params?.slug, userData)
        : addAnswerAction(params?.slug, userData));

      if (!isEmpty(res) && "success" in res && res?.success) {
        closeAnswerForm();
      }
      return res;
    },
    { errors: {}, success: false }
  );

  const form = useForm<AnswerType>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      description: answer?.description || "",
    },
    errors: ("errors" in res && res?.errors) || undefined,
  });

  const onSubmit = (values: AnswerType) => {
    startTransition(() => handleAddAnswer(values));
  };

  const onClose = () => {
    closeAnswerForm();
    form.reset();
  };

  return (
    <form id="answer-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
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
        <Button type="submit" className="mt-3" loading={isAddingAnswer}>
          Submit
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
  );
}
