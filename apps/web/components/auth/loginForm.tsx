"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { loginUserAction } from "@/actions/auth";
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
    <div className="bordered-card my-auto w-11/12 max-w-form p-2xl">
      <h1 className={`mb-lg font-display text-display`}>Welcome Back</h1>
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
            placeholder="Enter your password"
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
        <div className="mt-lg grid grid-cols-2 gap-md">
          <Button type="submit" loading={!isGuest && loadingLogin}>
            Login
          </Button>
          <Button
            type="button"
            variant={"outline"}
            onClick={onGuestLogin}
            loading={isGuest && loadingLogin}
          >
            Guest Login
          </Button>
        </div>
      </form>
      <div className="relative flex items-center py-lg">
        <div className="grow border-t border-gray-400"></div>
        <span className="mx-md shrink text-gray-400">Or</span>
        <div className="grow border-t border-gray-400"></div>
      </div>
      <div className="text-sm">
        <Link
          className="font-semibold text-primary underline"
          href={"/register"}
        >
          Register
        </Link>{" "}
        if you do not have an account
      </div>
    </div>
  );
}
