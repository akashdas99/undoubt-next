"use server";

import { registerUser } from "@/data/auth";
import dbConnect from "@/lib/dbConnect";
import { removeSession } from "@/lib/session";
import { LoginSchema, LoginType } from "@/lib/types";
import User from "@/models/user";
import { RegisterType } from "@/types/auth";
import bcryptjs from "bcryptjs";

// registerUserAction to create new user
export async function registerUserAction(userData: RegisterType) {
  return await registerUser(userData);
}
export async function loginUser(loginData: LoginType) {
  try {
    await dbConnect();
    //validate userData
    const validatedLoginData = LoginSchema.safeParse({
      ...loginData,
    });
    if (!validatedLoginData?.success) {
      throw new Error(
        JSON.stringify(validatedLoginData?.error?.flatten()?.fieldErrors)
      );
    }
    const { username, password } = validatedLoginData?.data;
    //if user exists
    const user = await User.findOne({ username: username }).select("+password");
    if (!user) {
      return {
        type: "username",
        message: "Username doesnot exist exists",
      };
    }
    const validPassword = await bcryptjs.compare(password, user?.password);
    if (!validPassword) {
      return {
        type: "password",
        message: "Wrong password",
      };
    }
    const tokenData = {
      id: user?._id?.toString(),
      username: user?.username,
    };
    // await createSession(tokenData);
  } catch (e) {
    console.log(e);
    return {
      type: "serverError",
      message: "Something went wrong",
    };
  }
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
