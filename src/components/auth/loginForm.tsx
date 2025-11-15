"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

//Components
import { loginUserAction } from "@/actions/auth";
import { Form, InputField } from "@/components/ui/form";
import { isEmpty } from "@/lib/functions";
import { userApi } from "@/lib/store/user/user";
import { LoginType } from "@/types/auth";
import { LoginSchema } from "@/validations/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isGuest, setIsGuest] = useState<boolean>();

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

  const onSubmit = form.handleSubmit((values: LoginType) => {
    setIsGuest(false);
    startTransition(() => handleLogin(values));
  });
  const onGuestLogin = async () => {
    const email = process.env.NEXT_PUBLIC_GUEST_EMAIL;
    const password = process.env.NEXT_PUBLIC_GUEST_PASSWORD;
    setIsGuest(true);
    if (email && password) {
      startTransition(() => handleLogin({ email, password }));
    }
  };
  return (
    <div className="bordered-card p-5 md:p-8 rounded-xl max-w-xs w-10/12 my-auto">
      <h1 className={`font-righteous text-xl md:text-3xl mb-3 md:mb-6 `}>
        Welcome Back
      </h1>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <InputField
            control={form.control}
            name="email"
            label="Email"
            placeholder="Email"
          />
          <InputField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Password"
            type="password"
          />

          {form?.formState?.errors?.root?.message && (
            <p className="text-[0.6rem] text-destructive font-medium">
              {form?.formState?.errors?.root?.message}
            </p>
          )}
          <div className="flex flex-wrap gap-x-2 mt-2">
            <Button
              type="submit"
              className="mt-3 flex-1"
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
      </Form>
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="flex-shrink mx-4 text-gray-400">Or</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <div className="text-xs">
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
