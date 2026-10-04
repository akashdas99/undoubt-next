"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { resetPasswordAction } from "@/actions/auth";
import { FieldError, FieldGroup } from "@workspace/ui/components/field";
import { FormPassword } from "@/components/ui/form";
import { isEmpty } from "@/lib/functions";
import { ResetPasswordType } from "@/types/auth";
import { ResetPasswordSchema } from "@workspace/validations/auth";
import Link from "next/link";
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
      <div className="bordered-card my-auto w-11/12 max-w-form p-2xl">
        <h1 className={`mb-xs font-display text-display`}>
          Password Reset Successful
        </h1>
        <p className="mb-md text-sm">
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
    <div className="bordered-card my-auto w-11/12 max-w-form p-2xl">
      <h1 className={`mb-xs font-display text-display`}>Reset Password</h1>
      <p className="mb-md text-sm">Enter your new password below.</p>
      <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormPassword
            control={form.control}
            name="password"
            label="New Password"
            placeholder="New Password"
            autoComplete="new-password"
          />
          <FormPassword
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm Password"
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
          className="mt-sm w-full"
          loading={loadingResetPassword}
        >
          Reset Password
        </Button>
      </form>
      <div className="mt-md text-sm">
        <Link className="font-semibold text-primary underline" href={"/login"}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}
