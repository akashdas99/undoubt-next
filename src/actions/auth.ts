"use server";

import { loginUser, registerUser } from "@/data/auth";
import { removeSession } from "@/lib/session";
import { withTryCatchResponse } from "@/lib/utils";
import { LoginType, RegisterType } from "@/types/auth";

// registerUserAction to create new user
export async function registerUserAction(userData: RegisterType) {
  return withTryCatchResponse(registerUser(userData));
}
export async function loginUserAction(loginData: LoginType) {
  return withTryCatchResponse(loginUser(loginData));
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
