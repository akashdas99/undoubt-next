"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { resetPasswordAction } from "@/actions/auth";
import { AuthHeading } from "@/components/auth/authHeading";
import { AuthSwitchLink } from "@/components/auth/authSwitchLink";
import { FieldError, FieldGroup } from "@workspace/ui/components/field";
import { FormPassword } from "@/components/ui/form";
import { isEmpty } from "@/lib/functions";
import { ResetPasswordType } from "@/types/auth";
import { ResetPasswordSchema } from "@workspace/validations/auth";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useState } from "react";
import { Button } from "@workspace/ui/components/button";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const [res, handleResetPassword, loadingResetPassword] = useActionState(
    async (_: unknown, userData: ResetPasswordType) => {
      const res = await resetPasswordAction(userData);
      if (!isEmpty(res) && "success" in res && res?.success) {
        setShowSuccess(true);
      }
      return res;
    },
    { errors: {}, success: false }
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
      <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormPassword
            control={form.control}
            name="password"
            label="New Password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          <FormPassword
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
        </FieldGroup>
        <FieldError
          errors={[
            form?.formState?.errors?.root,
            form?.formState?.errors?.token,
          ]}
        />
        <Button
          type="submit"
          size="lg"
          className="mt-sm w-full"
          loading={loadingResetPassword}
        >
          Reset Password
        </Button>
      </form>
      <AuthSwitchLink to="/login" prompt="Remembered your password?" />
    </>
  );
}
