"use client";
import { addAnswerAction, updateAnswerAction } from "@/actions/answer";
import { isEmpty } from "@/lib/functions";
import { AnswerSchema, AnswerType } from "@/validations/answer";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { EditorField, Form } from "../ui/form";
import { useParams } from "next/navigation";
import { Answer } from "@/db/schema/answers";

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
  const onSubmit = form.handleSubmit((values: AnswerType) => {
    startTransition(() => handleAddAnswer(values));
  });
  const onClose = () => {
    closeAnswerForm();
    form.reset();
  };
  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <EditorField control={form.control} name={"description"} />
        {form?.formState?.errors?.root?.message && (
          <p className="text-[0.6rem] text-destructive font-medium">
            {form?.formState?.errors?.root?.message}
          </p>
        )}
        <div className="flex flex-wrap gap-x-2 mt-2 flex-col sm:flex-row">
          <Button type="submit" className="mt-3" loading={isAddingAnswer}>
            Submit
          </Button>
          <Button onClick={onClose} className="mt-3" variant={"outline"}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
