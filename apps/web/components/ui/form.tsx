"use client";

import { useState } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import Editor from "./editor";
import { Field, FieldLabel, FieldError } from "@workspace/ui/components/field";

type FormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
};

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  autoComplete,
  className,
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
          <Input
            {...field}
            id={field.name}
            placeholder={placeholder}
            autoComplete={autoComplete}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

type FormPasswordProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
};

export function FormPassword<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  autoComplete = "current-password",
  className,
}: FormPasswordProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
          <div className="relative">
            <Input
              {...field}
              id={field.name}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              autoComplete={autoComplete}
              aria-invalid={fieldState.invalid}
              className="pr-2xl"
            />
            <button
              type="button"
              className="absolute top-1/2 right-sm -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="size-md" />
              ) : (
                <Eye className="size-md" />
              )}
            </button>
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

type FormEditorProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  className?: string;
};

export function FormEditor<T extends FieldValues>({
  control,
  name,
  label,
  className,
}: FormEditorProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
          <Editor
            content={field.value || ""}
            onChange={field.onChange}
            className="min-h-3xl bg-white"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
