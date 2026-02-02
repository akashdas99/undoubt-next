"use server";

import {
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
} from "@/data/auth";
import { removeSession } from "@/lib/session";
import { withTryCatchResponse } from "@/lib/utils";
import { refresh } from "next/cache";
import {
  ForgotPasswordType,
  LoginType,
  RegisterType,
  ResetPasswordType,
} from "@/types/auth";

// registerUserAction to create new user
export async function registerUserAction(userData: RegisterType) {
  return await withTryCatchResponse(registerUser(userData));
}
export async function loginUserAction(loginData: LoginType) {
  return await withTryCatchResponse(loginUser(loginData));
}
export async function logoutUserAction() {
  const result = await withTryCatchResponse(removeSession());
  refresh();
  return result;
}
export async function forgotPasswordAction(data: ForgotPasswordType) {
  return await withTryCatchResponse(forgotPassword(data));
}
export async function resetPasswordAction(data: ResetPasswordType) {
  return await withTryCatchResponse(resetPassword(data));
}
