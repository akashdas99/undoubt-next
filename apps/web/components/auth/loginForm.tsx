"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { loginUserAction } from "@/actions/auth";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { FormInput, FormPassword } from "@/components/ui/form";
import { isEmpty } from "@/lib/functions";
import { useInvalidateProfile } from "@/lib/queries/user";
import { LoginType } from "@/types/auth";
import { LoginSchema } from "@repo/validations/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useState } from "react";
import { Button } from "../ui/button";

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
    { errors: {}, success: false },
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
    <div className="bordered-card p-8 rounded-xl max-w-md w-11/12 my-auto">
      <h1 className={`font-righteous text-3xl mb-3 md:mb-6 `}>Welcome Back</h1>
      <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Email"
            autoComplete="email"
          />
          <FormPassword
            control={form.control}
            name="password"
            label="Password"
            placeholder="Password"
            autoComplete="current-password"
          />
        </FieldGroup>
        <div className="flex justify-end mt-1">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <FieldError errors={[form?.formState?.errors?.root]} />
        <div className="grid grid-cols-2 gap-x-2 mt-2">
          <Button
            type="submit"
            className="mt-3"
            loading={!isGuest && loadingLogin}
          >
            Login
          </Button>
          <Button
            type="button"
            className="mt-3"
            variant={"outline"}
            onClick={onGuestLogin}
            loading={isGuest && loadingLogin}
          >
            Guest Login
          </Button>
        </div>
      </form>
      <div className="relative flex py-2 items-center">
        <div className="grow border-t border-gray-400"></div>
        <span className="shrink mx-4 text-gray-400">Or</span>
        <div className="grow border-t border-gray-400"></div>
      </div>
      <div className="text-sm">
        <Link
          className="text-primary underline font-semibold"
          href={"/register"}
        >
          Register
        </Link>{" "}
        if you do not have an account
      </div>
    </div>
  );
}
