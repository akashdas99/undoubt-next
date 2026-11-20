"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authEndpoints } from "@/lib/auth/endpoints";
import { postForm } from "@/lib/api/form";
import { AuthHeading } from "@/components/auth/authHeading";
import { AuthSwitchLink } from "@/components/auth/authSwitchLink";
import { FormPassword } from "@/components/ui/form";
import { ResetPasswordType } from "@/types/auth";
import { Button } from "@workspace/ui/components/button";
import { FieldError, FieldGroup } from "@workspace/ui/components/field";
import { ResetPasswordSchema } from "@workspace/validations/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordType) =>
    postForm(authEndpoints.resetPassword, values, setError, () => {
      setShowSuccess(true);
    });

  if (showSuccess) {
    return (
      <>
        <AuthHeading
          title="Password Reset Successful"
          description="Your password has been reset successfully. You can now log in with your new password."
        />
        <Button
          onClick={() => router.push("/login")}
          size="lg"
          className="w-full"
          type="button"
        >
          Go to Login
        </Button>
      </>
    );
  }

  return (
    <>
      <AuthHeading
        title="Reset Password"
        description="Enter your new password below."
      />
      <form id="reset-password-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormPassword
            control={control}
            name="password"
            label="New Password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          <FormPassword
            control={control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
        </FieldGroup>
        <FieldError errors={[errors.root, errors.token]} />
        <Button
          type="submit"
          size="lg"
          className="mt-sm w-full"
          loading={isSubmitting}
        >
          Reset Password
        </Button>
      </form>
      <AuthSwitchLink to="/login" prompt="Remembered your password?" />
    </>
  );
}
