"use server";

import {
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
} from "@/data/auth";
import { removeSession } from "@/lib/session";
import { withTryCatchResponse } from "@/lib/utils";
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
export async function logoutUser() {
  try {
    await removeSession();
  } catch (e) {
    console.log(e);
    return {
      type: "serverError",
      message: "Something went wrong",
    };
  }
}
export async function forgotPasswordAction(data: ForgotPasswordType) {
  return await withTryCatchResponse(forgotPassword(data));
}
export async function resetPasswordAction(data: ResetPasswordType) {
  return await withTryCatchResponse(resetPassword(data));
}
