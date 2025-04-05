"use client";

import { addQuestionAction } from "@/actions/question";
import { QuestionSchema, QuestionType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { EditorField, Form, InputField } from "../ui/form";

export default function AddQuestion() {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<QuestionType>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const onSubmit = async (values: QuestionType) => {
    setLoading(true);
    const res = await addQuestionAction(values);
    setLoading(false);
    if (res?.error?.type === "serverError") {
      form.setError("root", {
        message: res?.error?.message,
      });
    }
  };

  return (
    <div className="flex items-center justify-center grow">
      <div className="bordered-card p-8 rounded-xl max-w-xl w-4/5">
        <h1 className={`font-righteous text-xl mb-6`}>Add Question</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <InputField
              control={form.control}
              name="title"
              label="Title"
              placeholder="Please enter a title for your question"
            />
            <EditorField
              control={form.control}
              name="description"
              label="Decription"
            />
            {form?.formState?.errors?.root?.message && (
              <p className="text-[0.6rem] text-destructive font-medium">
                {form?.formState?.errors?.root?.message}
              </p>
            )}
            <div className="flex flex-wrap gap-x-2 mt-2 flex-col sm:flex-row">
              <Button type="submit" className="mt-3" loading={loading}>
                Add Question
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
