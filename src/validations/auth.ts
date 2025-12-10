import { z } from "zod";

//Register Schema
export const RegisterSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  userName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

//Register Form Schema
export const RegisterFormSchema = RegisterSchema.extend({
  confirmPassword: z.string().min(8, {
    message: "Confirm password must be at least 8 characters.",
  }),
})
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  })
  .transform(({ name, userName, email, password }) => ({
    name,
    userName,
    email,
    password,
  }));

//Login Form Schema
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

//Forgot Password Schema
export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

//Reset Password Schema
export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, {
      message: "Token is required.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
