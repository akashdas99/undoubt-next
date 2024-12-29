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
  return (
    <div className="mx-[30%] mt-8">
      <div className="neo p-8 rounded-xl">
        <h1 className="text-xl mb-6">Login</h1>
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
      </div>
    </div>
  );
};

export default LoginForm;
