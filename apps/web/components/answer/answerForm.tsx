"use client";
import { FieldError, FieldGroup } from "@workspace/ui/components/field";
import { patchForm, postForm } from "@/lib/api/form";
import { answerEndpoints } from "@/lib/domain/endpoints";

import type { Answer } from "@workspace/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnswerSchema, AnswerType } from "@workspace/validations/answer";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
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
  const router = useRouter();
  const [isAddingAnswer, setIsAddingAnswer] = useState(false);

  const form = useForm<AnswerType>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      description: answer?.description || "",
    },
  });

  const onSubmit = async (userData: AnswerType) => {
    const slug = params?.slug;
    if (!slug) return;

    setIsAddingAnswer(true);
    try {
      const onSuccess = () => {
        closeAnswerForm();
        router.refresh();
      };

      if (answer) {
        await patchForm(
          answerEndpoints.update(answer.id),
          userData,
          form.setError,
          onSuccess
        );
      } else {
        await postForm(
          answerEndpoints.create(slug),
          userData,
          form.setError,
          onSuccess
        );
      }
    } finally {
      setIsAddingAnswer(false);
    }
  };

  const onClose = () => {
    closeAnswerForm();
    form.reset();
  };

  return (
    <form
      id={answer ? `answer-form-${answer.id}` : "answer-form"}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <FormEditor
          control={form.control}
          name="description"
          label="Description"
        />
      </FieldGroup>
      <FieldError errors={[form.formState.errors.root]} />
      <div className="mt-xs flex flex-col flex-wrap gap-x-xs sm:flex-row">
        <Button type="submit" className="mt-sm" loading={isAddingAnswer}>
          {answer ? "Save" : "Submit"}
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
