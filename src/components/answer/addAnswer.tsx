"use client";
import { addAnswerAction } from "@/actions/answer";
import { AnswerSchema, AnswerType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePenLine } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { EditorField, Form } from "../ui/form";

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
          variant={"default"}
          size={"sm"}
          onClick={() => setShowEditor(true)}
        >
          <FilePenLine /> Answer
        </Button>
      ) : (
        <div className="flex items-center justify-center grow">
          <div className="bordered-card p-8 rounded-xl  w-full">
            <h1 className={`font-righteous text-xl md:text-3xl mb-6`}>
              Add Answer
            </h1>
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
                    Submit
                  </Button>
                  <Button
                    onClick={() => setShowEditor(false)}
                    className="mt-3"
                    variant={"outline"}
                  >
                    Cancel
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
