"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { resetPasswordAction } from "@/actions/auth";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { FormPassword } from "@/components/ui/form";
import { isEmpty } from "@/lib/functions";
import { ResetPasswordType } from "@/types/auth";
import { ResetPasswordSchema } from "@repo/validations/auth";
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
