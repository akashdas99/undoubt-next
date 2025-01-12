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
    <div className="mx-[30%] mt-8">
      <div className="neo p-8 rounded-xl">
        <h1 className="text-xl mb-6">Create Account</h1>
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
      </div>
    </div>
  );
};

export default RegisterForm;
