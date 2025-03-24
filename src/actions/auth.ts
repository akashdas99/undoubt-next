"use server";

import dbConnect from "@/lib/dbConnect";
import { createSession, removeSession } from "@/lib/session";
import { LoginSchema, LoginType, UserSchema, UserType } from "@/lib/types";
import User from "@/models/user";
import bcryptjs from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerUser(userData: UserType) {
  try {
    await dbConnect();
    //validate userData
    const validatedUser = UserSchema.safeParse({
      ...userData,
    });
    if (!validatedUser?.success) {
      return {
        errors: validatedUser?.error?.flatten()?.fieldErrors,
      };
    }
    //if user exists
    const user = await User.findOne({ username: userData?.username });
    if (user)
      return {
        type: "username",
        message: "Username already exists",
      };

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(userData?.password, salt);
    const newUser = new User({
      ...userData,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    const tokenData = {
      id: savedUser?._id,
      username: savedUser?.username,
    };
    createSession(tokenData);
  } catch (e) {
    console.log(e);
    return {
      type: "serverError",
      message: "Something went wrong",
    };
  }
  redirect("/");
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
    const user = await User.findOne({ username: username });
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
      id: user?._id,
      username: user?.username,
    };
    createSession(tokenData);
  } catch (e) {
    console.log(e);
    return {
      type: "serverError",
      message: "Something went wrong",
    };
  }
  redirect("/");
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
