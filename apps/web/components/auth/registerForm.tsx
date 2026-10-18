"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { registerUserAction } from "@/actions/auth";
import { AuthHeading } from "@/components/auth/authHeading";
import { AuthSwitchLink } from "@/components/auth/authSwitchLink";
import { FormInput, FormPassword } from "@/components/ui/form";
import { isEmpty } from "@/lib/functions";
import { useInvalidateProfile } from "@/lib/queries/user";
import { RegisterType } from "@/types/auth";
import { Button } from "@workspace/ui/components/button";
import { FieldError, FieldGroup } from "@workspace/ui/components/field";
import { RegisterSchema } from "@workspace/validations/auth";
import { useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";

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
    <>
      <AuthHeading title="Register Account" />
      <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="grid-cols-2 gap-x-sm md:grid">
          <FormInput
            control={form.control}
            name="name"
            label="Name"
            placeholder="Full name"
            autoComplete="name"
          />
          <FormInput
            control={form.control}
            name="userName"
            label="Username"
            placeholder="yourname"
            autoComplete="username"
          />
          <FormInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
            className="col-span-2"
          />
          <FormPassword
            control={form.control}
            name="password"
            label="Password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className="col-span-2"
          />
        </FieldGroup>
        <FieldError errors={[form?.formState?.errors?.root]} />
        <Button
          type="submit"
          size="lg"
          className="col-span-2 mt-lg w-full justify-self-center"
          loading={loadingSignup}
        >
          Create Account
        </Button>
      </form>
      <AuthSwitchLink to="/login" prompt="Already have an account?" />
    </>
  );
};

export default RegisterForm;
