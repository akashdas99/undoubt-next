"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { authEndpoints } from "@/lib/auth/endpoints";
import { postForm } from "@/lib/api/form";
import { AuthHeading } from "@/components/auth/authHeading";
import { AuthSwitchLink } from "@/components/auth/authSwitchLink";
import { FormInput, FormPassword } from "@/components/ui/form";
import { useInvalidateProfile } from "@/lib/queries/user";
import { RegisterType } from "@/types/auth";
import { Button } from "@workspace/ui/components/button";
import { FieldError, FieldGroup } from "@workspace/ui/components/field";
import { RegisterSchema } from "@workspace/validations/auth";
import { useRouter } from "next/navigation";

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const invalidateProfile = useInvalidateProfile();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      userName: "",
      password: "",
    },
  });

  const onSubmit = (values: RegisterType) =>
    postForm(authEndpoints.register, values, setError, () => {
      router.replace("/");
      router.refresh();
      invalidateProfile();
    });

  return (
    <>
      <AuthHeading title="Register Account" />
      <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup className="grid-cols-2 gap-x-sm md:grid">
          <FormInput
            control={control}
            name="name"
            label="Name"
            placeholder="Full name"
            autoComplete="name"
          />
          <FormInput
            control={control}
            name="userName"
            label="Username"
            placeholder="yourname"
            autoComplete="username"
          />
          <FormInput
            control={control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
            className="col-span-2"
          />
          <FormPassword
            control={control}
            name="password"
            label="Password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className="col-span-2"
          />
        </FieldGroup>
        <FieldError errors={[errors.root]} />
        <Button
          type="submit"
          size="lg"
          className="col-span-2 mt-lg w-full justify-self-center"
          loading={isSubmitting}
        >
          Create Account
        </Button>
      </form>
      <AuthSwitchLink to="/login" prompt="Already have an account?" />
    </>
  );
};

export default RegisterForm;
