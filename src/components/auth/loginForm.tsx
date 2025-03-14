"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

//Components
import { loginUser } from "@/actions/auth";
import { Form, InputField } from "@/components/ui/form";
import { LoginSchema, LoginType } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function LoginForm(): JSX.Element {
  const router = useRouter();

  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [loadingGuestLogin, setLoadingGuestLogin] = useState<boolean>(false);
  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (values: LoginType) => {
    setLoadingLogin(true);
    const res: Partial<{
      type: string;
      message: string;
    }> = await loginUser(values);

    setLoadingLogin(false);

    if (res?.type === "serverError") {
      form.setError("root", {
        message: res?.message,
      });
    } else if (res?.type === "username") {
      form.setError("username", {
        message: res?.message,
      });
    } else if (res?.type === "password") {
      form.setError("password", {
        message: res?.message,
      });
    }
    router.refresh();
  };
  const onGuestLogin = async () => {
    const username = process.env.NEXT_PUBLIC_GUEST_USERNAME;
    const password = process.env.NEXT_PUBLIC_GUEST_PASSWORD;
    if (!username || !password)
      return form.setError("root", {
        message: "Guest User is not available",
      });

    setLoadingGuestLogin(true);
    const res: Partial<{
      type: string;
      message: string;
    }> = await loginUser({ username, password });

    if (res?.type === "serverError") {
      form.setError("root", {
        message: res?.message,
      });
    }
    setLoadingGuestLogin(false);
    router.refresh();
  };
  return (
    <div className="flex items-center justify-center grow">
      <div className="neo p-8 rounded-xl max-w-xs w-4/5">
        <h1 className={`font-righteous text-xl mb-6`}>Welcome Back</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <InputField
              control={form.control}
              name="username"
              label="Username"
              placeholder="Username"
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
            <div className="flex flex-wrap gap-x-2 mt-2 flex-col sm:flex-row">
              <Button type="submit" className="mt-3" loading={loadingLogin}>
                Login
              </Button>
              <Button
                type="button"
                className="mt-3"
                variant={"outline"}
                onClick={onGuestLogin}
                loading={loadingGuestLogin}
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
    </div>
  );
}
