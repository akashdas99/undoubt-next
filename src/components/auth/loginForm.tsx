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
import { userApi } from "@/lib/store/user/user";
import { useDispatch } from "react-redux";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();

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
    const res: Partial<
      | {
          type: string;
          message: string;
        }
      | undefined
    > = await loginUser(values);

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
    } else {
      router.refresh();
      dispatch(userApi.util.invalidateTags(["profile"]));
      router.replace("/");
    }
  };
  const onGuestLogin = async () => {
    const username = process.env.NEXT_PUBLIC_GUEST_USERNAME;
    const password = process.env.NEXT_PUBLIC_GUEST_PASSWORD;
    if (!username || !password)
      return form.setError("root", {
        message: "Guest User is not available",
      });

    setLoadingGuestLogin(true);
    const res: Partial<
      | {
          type: string;
          message: string;
        }
      | undefined
    > = await loginUser({ username, password });

    if (res?.type === "serverError") {
      form.setError("root", {
        message: res?.message,
      });
    } else {
      router.refresh();
      dispatch(userApi.util.invalidateTags(["profile"]));
      router.replace("/");
    }
    setLoadingGuestLogin(false);
  };
  return (
    <div className="bordered-card p-5 md:p-8 rounded-xl max-w-xs w-10/12 my-auto">
      <h1 className={`font-righteous text-xl md:text-3xl mb-3 md:mb-6 `}>
        Welcome Back
      </h1>
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
  );
}
