"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthHeading } from "@/components/auth/authHeading";
import { AuthSwitchLink } from "@/components/auth/authSwitchLink";
import { FormInput, FormPassword } from "@/components/ui/form";
import { postForm } from "@/lib/api/form";
import { authEndpoints } from "@/lib/auth/endpoints";
import { useInvalidateProfile } from "@/lib/queries/user";
import { LoginType } from "@/types/auth";
import { Button } from "@workspace/ui/components/button";
import { FieldError, FieldGroup } from "@workspace/ui/components/field";
import { LoginSchema } from "@workspace/validations/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const invalidateProfile = useInvalidateProfile();
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginType) =>
    postForm(authEndpoints.login, values, setError, () => {
      router.replace("/");
      router.refresh();
      invalidateProfile();
    });

  const onGuestLogin = async () => {
    const email = process.env.NEXT_PUBLIC_GUEST_EMAIL;
    const password = process.env.NEXT_PUBLIC_GUEST_PASSWORD;
    if (!email || !password) {
      return;
    }
    setIsGuestLoading(true);
    try {
      await onSubmit({ email, password });
    } catch (error) {
      console.error(error);
      setIsGuestLoading(false);
    }
  };

  return (
    <>
      <AuthHeading
        title="Welcome Back"
        description="Continue exploring answers, discussions, and solutions."
      />
      <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormInput
            control={control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
          />
          <FormPassword
            control={control}
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
        <FieldError errors={[errors.root]} />
        <div className="mt-lg flex flex-col gap-sm">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={isSubmitting}
          >
            Login
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onGuestLogin}
            loading={isGuestLoading}
          >
            Explore as Guest
          </Button>
        </div>
      </form>
      <AuthSwitchLink to="/register" prompt="New to Undoubt?" />
    </>
  );
}
