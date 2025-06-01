"use client";
import { addAnswerAction } from "@/actions/answer";
import { AnswerSchema, AnswerType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePenLine } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import AnswerForm from "./answerForm";

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
    } else setShowEditor(false);
  };
  useEffect(() => {
    if (!showEditor) form.reset();
  }, [showEditor, form]);

  return (
    <div>
      {!showEditor ? (
        <Button
          type="button"
          variant={"default"}
          size={"lg"}
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
            <AnswerForm
              form={form}
              name="description"
              onSubmit={onSubmit}
              isLoading={loading}
              onCancel={() => setShowEditor(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
