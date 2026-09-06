"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { forgotPasswordAction } from "@/actions/auth";
import { FieldError, FieldGroup } from "@workspace/ui/components/field";
import { FormInput } from "@/components/ui/form";
import { isEmpty } from "@/lib/functions";
import { ForgotPasswordType } from "@/types/auth";
import { ForgotPasswordSchema } from "@workspace/validations/auth";
import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { Button } from "@workspace/ui/components/button";

export default function ForgotPasswordForm() {
  const [showSuccess, setShowSuccess] = useState(false);

  const [res, handleForgotPassword, loadingForgotPassword] = useActionState(
    async (_: unknown, userData: ForgotPasswordType) => {
      const res = await forgotPasswordAction(userData);
      if (!isEmpty(res) && "success" in res && res?.success) {
        setShowSuccess(true);
      }
      return res;
    },
    { errors: {}, success: false }
  );

  const form = useForm<ForgotPasswordType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    errors: ("errors" in res && res?.errors) || undefined,
  });

  const onSubmit = (values: ForgotPasswordType) => {
    startTransition(() => handleForgotPassword(values));
  };

  if (showSuccess) {
    return (
      <div className="bordered-card my-auto w-11/12 max-w-form p-2xl">
        <h1 className={`mb-xs font-righteous text-display`}>
          Check Your Email
        </h1>
        <p className="mb-4 text-sm">
          If an account exists with that email, a password reset link has been
          sent.
        </p>
        <Link
          href="/login"
          className="block text-sm text-primary hover:underline"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bordered-card my-auto w-11/12 max-w-form p-2xl">
      <h1 className={`mb-xs font-righteous text-display`}>
        Forgot Password
      </h1>
      <p className="mb-4 text-sm">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>
      <form id="forgot-password-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Email"
            autoComplete="email"
          />
        </FieldGroup>
        <FieldError errors={[form?.formState?.errors?.root]} />
        <Button
          type="submit"
          className="mt-3 w-full"
          loading={loadingForgotPassword}
        >
          Send Reset Link
        </Button>
      </form>
      <div className="mt-4 text-sm">
        <Link className="font-semibold text-primary underline" href={"/login"}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}
