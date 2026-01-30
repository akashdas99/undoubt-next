"use client";
import { addAnswerAction, updateAnswerAction } from "@/actions/answer";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { isEmpty } from "@/lib/functions";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import Editor from "../ui/editor";
import { useParams } from "next/navigation";
import { Answer } from "@/db/schema/answers";
import { AnswerSchema, AnswerType } from "@repo/validations/answer";

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
    { errors: {}, success: false },
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
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Editor content={field.value} onChange={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      {form?.formState?.errors?.root?.message && (
        <p className="text-[0.6rem] text-destructive font-medium">
          {form?.formState?.errors?.root?.message}
        </p>
      )}
      <div className="flex flex-wrap gap-x-2 mt-2 flex-col sm:flex-row">
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
