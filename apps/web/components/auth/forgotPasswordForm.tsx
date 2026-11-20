"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authEndpoints } from "@/lib/auth/endpoints";
import { postForm } from "@/lib/api/form";
import { AuthHeading } from "@/components/auth/authHeading";
import { AuthSwitchLink } from "@/components/auth/authSwitchLink";
import { FormInput } from "@/components/ui/form";
import { ForgotPasswordType } from "@/types/auth";
import { Button } from "@workspace/ui/components/button";
import { FieldError, FieldGroup } from "@workspace/ui/components/field";
import { ForgotPasswordSchema } from "@workspace/validations/auth";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordType) =>
    postForm(authEndpoints.forgotPassword, values, setError, () => {
      setShowSuccess(true);
    });

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
      <form id="forgot-password-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormInput
            control={control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </FieldGroup>
        <FieldError errors={[errors.root]} />
        <Button
          type="submit"
          size="lg"
          className="mt-sm w-full"
          loading={isSubmitting}
        >
          Send Reset Link
        </Button>
      </form>
      <AuthSwitchLink to="/login" prompt="Remembered your password?" />
    </>
  );
}
