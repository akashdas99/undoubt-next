"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { forgotPasswordAction } from "@/actions/auth";
import { Form, InputField } from "@/components/ui/form";
import { isEmpty } from "@/lib/functions";
import { ForgotPasswordType } from "@/types/auth";
import { ForgotPasswordSchema } from "@/validations/auth";
import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { Button } from "../ui/button";

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

  const onSubmit = form.handleSubmit((values: ForgotPasswordType) => {
    startTransition(() => handleForgotPassword(values));
  });

  if (showSuccess) {
    return (
      <div className="bordered-card p-5 md:p-8 rounded-xl max-w-md w-10/12 my-auto">
        <h1 className={`font-righteous text-3xl mb-3 md:mb-6`}>
          Check Your Email
        </h1>
        <p className="text-sm mb-4">
          If an account exists with that email, a password reset link has been
          sent.
        </p>
        <Link
          href="/login"
          className="text-sm text-primary hover:underline block"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bordered-card p-5 md:p-8 rounded-xl max-w-md w-10/12 my-auto">
      <h1 className={`font-righteous text-3xl mb-3 md:mb-6`}>
        Forgot Password
      </h1>
      <p className="text-sm mb-4">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <InputField
            control={form.control}
            name="email"
            label="Email"
            placeholder="Email"
          />

          {form?.formState?.errors?.root?.message && (
            <p className="text-[0.6rem] text-destructive font-medium">
              {form?.formState?.errors?.root?.message}
            </p>
          )}
          <Button
            type="submit"
            className="mt-3 w-full"
            loading={loadingForgotPassword}
          >
            Send Reset Link
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-sm">
        <Link className="text-primary underline font-semibold" href={"/login"}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}
