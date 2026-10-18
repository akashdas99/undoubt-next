"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { registerUserAction } from "@/actions/auth";
import { FieldError, FieldGroup } from "@workspace/ui/components/field";
import { FormInput, FormPassword } from "@/components/ui/form";
import { isEmpty } from "@/lib/functions";
import { useInvalidateProfile } from "@/lib/queries/user";
import { RegisterType } from "@/types/auth";
import { RegisterSchema } from "@workspace/validations/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";
import { Button } from "@workspace/ui/components/button";

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
    { errors: {}, success: false }
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
    <div className="bordered-card my-auto w-11/12 max-w-form p-2xl">
      <h1 className={`mb-xs font-display text-display`}>Register Account</h1>
      <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="grid-cols-2 gap-x-sm md:grid">
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
          className="col-span-2 mt-lg w-full justify-self-center"
          loading={loadingSignup}
        >
          Create Account
        </Button>
      </form>
      <div className="relative flex items-center py-xs">
        <div className="grow border-t border-gray-400"></div>
        <span className="mx-md shrink text-gray-400">Or</span>
        <div className="grow border-t border-gray-400"></div>
      </div>
      <div className="text-sm">
        <Link className="font-semibold text-primary underline" href={"/login"}>
          Login
        </Link>{" "}
        if you already have an account
      </div>
    </div>
  );
};

export default RegisterForm;
