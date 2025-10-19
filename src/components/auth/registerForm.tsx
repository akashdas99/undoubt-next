"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

//Components
import { registerUserAction } from "@/actions/auth";
import { Form, InputField } from "@/components/ui/form";
import { isEmpty } from "@/lib/functions";
import { userApi } from "@/lib/store/user/user";
import { RegisterType } from "@/types/auth";
import { RegisterSchema } from "@/validations/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [res, handleRegister, loadingSignup] = useActionState(
    async (_: any, userData: RegisterType) => {
      const res = await registerUserAction(userData);
      if (!isEmpty(res) && "success" in res && res?.success) {
        router.replace("/");
        router.refresh();
        dispatch(userApi.util.invalidateTags(["profile"]));
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

  const onSubmit = form.handleSubmit((values: RegisterType) => {
    startTransition(() => handleRegister(values));
  });

  return (
    <div className="bordered-card p-5 md:p-8 rounded-xl max-w-lg w-10/12 my-auto">
      <h1 className={`font-righteous text-xl md:text-3xl mb-3 md:mb-6`}>
        Register Account
      </h1>
      <Form {...form}>
        <form onSubmit={onSubmit} className="md:grid grid-cols-2 gap-x-3">
          <InputField
            control={form.control}
            name="name"
            label="Name"
            placeholder="Name"
          />
          <InputField
            control={form.control}
            name="userName"
            label="Username"
            placeholder="Username"
          />
          <InputField
            control={form.control}
            name="email"
            label="Email"
            placeholder="Email"
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
          <Button
            type="submit"
            className="mt-5 justify-self-center col-span-2 w-full"
            loading={loadingSignup}
          >
            Create Account
          </Button>
        </form>
      </Form>
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="flex-shrink mx-4 text-gray-400">Or</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <div className="text-xs">
        <Link className="text-primary underline font-semibold" href={"/login"}>
          Login
        </Link>{" "}
        if you already have an account
      </div>
    </div>
  );
};

export default RegisterForm;
