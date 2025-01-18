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
import { registerUser } from "@/actions/auth";
import { UserType, UserSchema } from "@/lib/types";
import { Righteous } from "next/font/google";
import Link from "next/link";

const croissantOne = Righteous({
  weight: "400",
  subsets: ["latin"],
});
const RegisterForm: React.FC = () => {
  const form = useForm<UserType>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      profession: "",
      city: "",
      country: "",
    },
  });
  const onSubmit = async (values: UserType) => {
    const res: Partial<{
      type: string;
      message: string;
    }> = await registerUser(values);

    if (res?.type === "username")
      form.setError("username", {
        message: res?.message,
      });
    else if (res?.type === "serverError")
      form.setError("root", {
        message: res?.message,
      });
  };

  return (
    <div className="flex items-center justify-center grow overflow-hidden">
      <div className="neo p-8 rounded-xl max-w-xs w-4/5">
        <h1 className={`${croissantOne?.className} text-xl mb-6`}>
          Register Account
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white focus-visible:ring-blue-500"
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profession</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white focus-visible:ring-blue-500"
                      placeholder="Profession"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white focus-visible:ring-blue-500"
                      placeholder="City"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white focus-visible:ring-blue-500focus-visible:ring-blue-500"
                      placeholder="Country"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form?.formState?.errors?.root?.message && (
              <p className="text-[0.8rem] text-destructive">
                {form?.formState?.errors?.root?.message}
              </p>
            )}
            <Button type="submit" className="mt-2">
              Submit
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
            href={"/login"}
          >
            Login
          </Link>{" "}
          if you already have an account
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
