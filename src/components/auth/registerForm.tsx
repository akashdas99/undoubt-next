"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

//Components
import { registerUser } from "@/actions/auth";
import { Form, InputField } from "@/components/ui/form";
import { UserSchema, UserType } from "@/lib/types";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterForm: React.FC = () => {
  const [loadingSignup, setLoadingSignup] = useState<boolean>(false);
  const router = useRouter();

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
    setLoadingSignup(true);

    const res: Partial<{
      type: string;
      message: string;
    }> = await registerUser(values);
    setLoadingSignup(false);

    if (res?.type === "username")
      form.setError("username", {
        message: res?.message,
      });
    else if (res?.type === "serverError")
      form.setError("root", {
        message: res?.message,
      });
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center grow overflow-hidden">
      <div className="neo p-8 rounded-xl max-w-xs w-4/5">
        <h1 className={`font-righteous text-xl mb-6`}>Register Account</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <InputField
              control={form.control}
              name="name"
              label="Name"
              placeholder="Name"
            />
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
            <InputField
              control={form.control}
              name="profession"
              label="Profession"
              placeholder="Profession"
            />
            <InputField
              control={form.control}
              name="city"
              label="City"
              placeholder="City"
            />
            <InputField
              control={form.control}
              name="country"
              label="Country"
              placeholder="Country"
            />

            {form?.formState?.errors?.root?.message && (
              <p className="text-[0.6rem] text-destructive font-medium">
                {form?.formState?.errors?.root?.message}
              </p>
            )}
            <Button type="submit" className="mt-2" loading={loadingSignup}>
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
            className="text-primary underline font-semibold"
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
