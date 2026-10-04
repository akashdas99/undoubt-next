"use client";
import { addAnswerAction, updateAnswerAction } from "@/actions/answer";
import { FieldGroup } from "@workspace/ui/components/field";
import { isEmpty } from "@/lib/functions";

import { Answer } from "@/db/schema/answers";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnswerSchema, AnswerType } from "@workspace/validations/answer";
import { useParams } from "next/navigation";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@workspace/ui/components/button";
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
        <p className="text-xs font-medium text-destructive">
          {form?.formState?.errors?.root?.message}
        </p>
      )}
      <div className="mt-xs flex flex-col flex-wrap gap-x-xs sm:flex-row">
        <Button type="submit" className="mt-sm" loading={isAddingAnswer}>
          Submit
        </Button>
        <Button
          type="button"
          onClick={onClose}
          className="mt-sm"
          variant={"outline"}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
