"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { resetPasswordAction } from "@/actions/auth";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { isEmpty } from "@/lib/functions";
import { ResetPasswordType } from "@/types/auth";
import { ResetPasswordSchema } from "@repo/validations/auth";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useState } from "react";
import { Button } from "../ui/button";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [res, handleResetPassword, loadingResetPassword] = useActionState(
    async (_: unknown, userData: ResetPasswordType) => {
      const res = await resetPasswordAction(userData);
      if (!isEmpty(res) && "success" in res && res?.success) {
        setShowSuccess(true);
      }
      return res;
    },
    { errors: {}, success: false },
  );

  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
    errors: ("errors" in res && res?.errors) || undefined,
  });

  const onSubmit = (values: ResetPasswordType) => {
    startTransition(() => handleResetPassword(values));
  };

  if (showSuccess) {
    return (
      <div className="bordered-card p-8 rounded-xl max-w-md w-11/12 my-auto">
        <h1 className={`font-righteous text-3xl mb-3 md:mb-6`}>
          Password Reset Successful
        </h1>
        <p className="text-sm mb-4">
          Your password has been reset successfully. You can now log in with
          your new password.
        </p>
        <Button
          onClick={() => router.push("/login")}
          className="w-full"
          type="button"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="bordered-card p-8 rounded-xl max-w-md w-11/12 my-auto">
      <h1 className={`font-righteous text-3xl mb-3 md:mb-6`}>Reset Password</h1>
      <p className="text-sm mb-4">Enter your new password below.</p>
      <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id={field.name}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        {form?.formState?.errors?.root?.message && (
          <p className="text-[0.6rem] text-destructive font-medium">
            {form?.formState?.errors?.root?.message}
          </p>
        )}
        {form?.formState?.errors?.token?.message && (
          <p className="text-[0.6rem] text-destructive font-medium mb-2">
            {form?.formState?.errors?.token?.message}
          </p>
        )}
        <Button
          type="submit"
          className="mt-3 w-full"
          loading={loadingResetPassword}
        >
          Reset Password
        </Button>
      </form>
      <div className="mt-4 text-sm">
        <Link className="text-primary underline font-semibold" href={"/login"}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}
