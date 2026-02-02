"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { registerUserAction } from "@/actions/auth";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { FormInput, FormPassword } from "@/components/ui/form";
import { isEmpty } from "@/lib/functions";
import { useInvalidateProfile } from "@/lib/queries/user";
import { RegisterType } from "@/types/auth";
import { RegisterSchema } from "@repo/validations/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";
import { Button } from "../ui/button";

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const invalidateProfile = useInvalidateProfile();

  const [res, handleRegister, loadingSignup] = useActionState(
    async (_: unknown, userData: RegisterType) => {
      const res = await registerUserAction(userData);
      if (!isEmpty(res) && "success" in res && res?.success) {
        router.replace("/");
        router.refresh();
        invalidateProfile();
      }
      return res;
    },
    { errors: {}, success: false },
  );

  const form = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      userName: "",
      password: "",
    },
    errors: ("errors" in res && res?.errors) || undefined,
  });

  const onSubmit = (values: RegisterType) => {
    startTransition(() => handleRegister(values));
  };

  return (
    <div className="bordered-card p-8 rounded-xl max-w-md w-11/12 my-auto">
      <h1 className={`font-righteous text-3xl mb-3 md:mb-6`}>
        Register Account
      </h1>
      <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="md:grid grid-cols-2 gap-x-3">
          <FormInput
            control={form.control}
            name="name"
            label="Name"
            placeholder="Name"
            autoComplete="name"
          />
          <FormInput
            control={form.control}
            name="userName"
            label="Username"
            placeholder="Username"
            autoComplete="username"
          />
          <FormInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Email"
            autoComplete="email"
            className="col-span-2"
          />
          <FormPassword
            control={form.control}
            name="password"
            label="Password"
            placeholder="Password"
            autoComplete="new-password"
            className="col-span-2"
          />
        </FieldGroup>
        <FieldError errors={[form?.formState?.errors?.root]} />
        <Button
          type="submit"
          className="mt-5 justify-self-center col-span-2 w-full"
          loading={loadingSignup}
        >
          Create Account
        </Button>
      </form>
      <div className="relative flex py-2 items-center">
        <div className="grow border-t border-gray-400"></div>
        <span className="shrink mx-4 text-gray-400">Or</span>
        <div className="grow border-t border-gray-400"></div>
      </div>
      <div className="text-sm">
        <Link className="text-primary underline font-semibold" href={"/login"}>
          Login
        </Link>{" "}
        if you already have an account
      </div>
    </div>
  );
};

export default RegisterForm;
