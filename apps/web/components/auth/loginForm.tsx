"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { loginUserAction } from "@/actions/auth";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { isEmpty } from "@/lib/functions";
import { userApi } from "@/lib/store/user/user";
import { LoginType } from "@/types/auth";
import { LoginSchema } from "@repo/validations/auth";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isGuest, setIsGuest] = useState<boolean>();
  const [showPassword, setShowPassword] = useState(false);

  const [res, handleLogin, loadingLogin] = useActionState(
    async (_: unknown, userData: LoginType) => {
      const res = await loginUserAction(userData);
      if (!isEmpty(res) && "success" in res && res?.success) {
        router.replace("/");
        router.refresh();
        dispatch(userApi.util.invalidateTags(["profile"]));
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
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
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
        {form?.formState?.errors?.root?.message && (
          <p className="text-[0.6rem] text-destructive font-medium">
            {form?.formState?.errors?.root?.message}
          </p>
        )}
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
        if you donot have an account
      </div>
    </div>
  );
}
