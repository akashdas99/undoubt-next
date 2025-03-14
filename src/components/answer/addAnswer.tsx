"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { EditorField, Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnswerSchema, AnswerType } from "@/lib/types";
import { addAnswerAction } from "@/actions/answer";
import { useParams } from "next/navigation";

export default function AddAnswer() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const params = useParams<{ slug: string }>();
  const form = useForm<AnswerType>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      description: "",
    },
  });
  const onSubmit = async (values: AnswerType) => {
    setLoading(true);
    const res = await addAnswerAction(params?.slug, values);
    setLoading(false);
    if (res?.error?.type === "serverError") {
      form.setError("root", {
        message: res?.error?.message,
      });
    }
  };
  return (
    <div>
      {!showEditor ? (
        <Button
          type="button"
          className="mt-3 neo"
          variant={"default"}
          size={"sm"}
          onClick={() => setShowEditor(true)}
        >
          <Plus /> Answer
        </Button>
      ) : (
        <div className="flex items-center justify-center grow">
          <div className="neo p-8 rounded-xl  w-full">
            <h1 className={`font-righteous text-xl mb-6`}>Add Answer</h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <EditorField control={form.control} name="description" />
                {form?.formState?.errors?.root?.message && (
                  <p className="text-[0.6rem] text-destructive font-medium">
                    {form?.formState?.errors?.root?.message}
                  </p>
                )}
                <div className="flex flex-wrap gap-x-2 mt-2 flex-col sm:flex-row">
                  <Button type="submit" className="mt-3" loading={loading}>
                    <Plus /> Answer
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
