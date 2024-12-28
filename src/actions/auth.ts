"use server";

import dbConnect from "@/lib/dbConnect";
import { createSession } from "@/lib/session";
import { UserSchema, UserType } from "@/lib/types";
import User from "@/models/user";
import bcryptjs from "bcryptjs";
import { redirect } from "next/navigation";

dbConnect();

export async function registerUser(userData: UserType) {
  try {
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
