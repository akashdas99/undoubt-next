"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

//Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { loginUser } from "@/actions/auth";
import { LoginSchema, LoginType } from "@/lib/types";
import { Righteous } from "next/font/google";
import Link from "next/link";

const croissantOne = Righteous({
  weight: "400",
  subsets: ["latin"],
});
const LoginForm: React.FC = () => {
  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (values: LoginType) => {
    const res: Partial<{
      type: string;
      message: string;
    }> = await loginUser(values);

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
  };
  const onGuestLogin = async () => {
    const username = process.env.NEXT_PUBLIC_GUEST_USERNAME;
    const password = process.env.NEXT_PUBLIC_GUEST_PASSWORD;
    if (!username || !password)
      return form.setError("root", {
        message: "Guest User is not available",
      });
    await loginUser({ username, password });
  };
  return (
    <div className="flex items-center justify-center grow">
      <div className="neo p-8 rounded-xl max-w-xs w-4/5">
        <h1 className={`${croissantOne?.className} text-xl mb-6`}>
          Welcome Back
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white focus-visible:ring-blue-500"
                      placeholder="Username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white focus-visible:ring-blue-500"
                      placeholder="Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form?.formState?.errors?.root?.message && (
              <p className="text-[0.6rem] text-destructive font-medium">
                {form?.formState?.errors?.root?.message}
              </p>
            )}
            <Button type="submit" className="mt-3">
              Login
            </Button>
            <Button type="button" className="mt-3 ms-2" onClick={onGuestLogin}>
              Login as Guest
            </Button>
          </form>
        </Form>
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-gray-400">Or</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <div className="text-xs">
          <Link
            className="text-[--chefchaouen-blue] underline font-semibold"
            href={"/register"}
          >
            Register
          </Link>{" "}
          if you donot have an account
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
