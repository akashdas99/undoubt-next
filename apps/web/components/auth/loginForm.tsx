"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { loginUserAction } from "@/actions/auth";
import { AuthHeading } from "@/components/auth/authHeading";
import { AuthSwitchLink } from "@/components/auth/authSwitchLink";
import { FormInput, FormPassword } from "@/components/ui/form";
import { isEmpty } from "@/lib/functions";
import { useInvalidateProfile } from "@/lib/queries/user";
import { LoginType } from "@/types/auth";
import { Button } from "@workspace/ui/components/button";
import { FieldError, FieldGroup } from "@workspace/ui/components/field";
import { LoginSchema } from "@workspace/validations/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const invalidateProfile = useInvalidateProfile();
  const [isGuest, setIsGuest] = useState<boolean>();

  const [res, handleLogin, loadingLogin] = useActionState(
    async (_: unknown, userData: LoginType) => {
      const res = await loginUserAction(userData);
      if (!isEmpty(res) && "success" in res && res?.success) {
        router.replace("/");
        router.refresh();
        invalidateProfile();
      }
      return res;
    },
    { errors: {}, success: false }
  );

  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    errors: ("errors" in res && res?.errors) || undefined,
  });

  const onSubmit = (values: LoginType) => {
    setIsGuest(false);
    startTransition(() => handleLogin(values));
  };

  const onGuestLogin = async () => {
    const email = process.env.NEXT_PUBLIC_GUEST_EMAIL;
    const password = process.env.NEXT_PUBLIC_GUEST_PASSWORD;
    setIsGuest(true);
    if (email && password) {
      startTransition(() => handleLogin({ email, password }));
    }
  };

  return (
    <>
      <AuthHeading
        title="Welcome Back"
        description="Continue exploring answers, discussions, and solutions."
      />
      <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
          />
          <FormPassword
            control={form.control}
            name="password"
            label="Password"
            placeholder="Your password"
            autoComplete="current-password"
          />
        </FieldGroup>
        <div className="mt-sm flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <FieldError errors={[form?.formState?.errors?.root]} />
        <div className="mt-lg flex flex-col gap-sm">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={!isGuest && loadingLogin}
          >
            Login
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onGuestLogin}
            loading={isGuest && loadingLogin}
          >
            Explore as Guest
          </Button>
        </div>
      </form>
      <AuthSwitchLink to="/register" prompt="New to Undoubt?" />
    </>
  );
}
