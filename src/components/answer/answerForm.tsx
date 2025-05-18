import React from "react";
import { Button } from "../ui/button";
import { EditorField, Form } from "../ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function AnswerForm<T extends FieldValues>({
  form,
  name,
  isLoading,
  onSubmit,
  onCancel,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  isLoading: boolean;
  onSubmit: (values: T) => void;
  onCancel: () => void;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <EditorField control={form.control} name={name} />
        {form?.formState?.errors?.root?.message && (
          <p className="text-[0.6rem] text-destructive font-medium">
            {form?.formState?.errors?.root?.message}
          </p>
        )}
        <div className="flex flex-wrap gap-x-2 mt-2 flex-col sm:flex-row">
          <Button type="submit" className="mt-3" loading={isLoading}>
            Submit
          </Button>
          <Button onClick={onCancel} className="mt-3" variant={"outline"}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
