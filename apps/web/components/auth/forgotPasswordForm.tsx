"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { forgotPasswordAction } from "@/actions/auth";
import { AuthHeading } from "@/components/auth/authHeading";
import { AuthSwitchLink } from "@/components/auth/authSwitchLink";
import { FieldError, FieldGroup } from "@workspace/ui/components/field";
import { FormInput } from "@/components/ui/form";
import { isEmpty } from "@/lib/functions";
import { ForgotPasswordType } from "@/types/auth";
import { ForgotPasswordSchema } from "@workspace/validations/auth";
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
      <>
        <AuthHeading
          title="Check Your Email"
          description="If an account exists with that email, a password reset link has been sent."
        />
        <AuthSwitchLink to="/login" prompt="Ready to sign in?" />
      </>
    );
  }

  return (
    <>
      <AuthHeading
        title="Forgot Password"
        description="Enter your email address and we'll send you a link to reset your password."
      />
      <form id="forgot-password-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </FieldGroup>
        <FieldError errors={[form?.formState?.errors?.root]} />
        <Button
          type="submit"
          size="lg"
          className="mt-sm w-full"
          loading={loadingForgotPassword}
        >
          Send Reset Link
        </Button>
      </form>
      <AuthSwitchLink to="/login" prompt="Remembered your password?" />
    </>
  );
}
