"use server";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

dbConnect();

export async function registerUser(userData: {
  name: string;
  username: string;
  password: string;
  profession: string;
  city: string;
  country: string;
}) {
  try {
    //if user exists
    const user = await User.findOne({ username: userData?.username });
    if (user)
      return {
        error: "Username already exists",
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
    const token = jwt.sign(tokenData, process.env.SECRET!, {
      expiresIn: "10h",
    });
    cookies().set("token", token, { httpOnly: true });
    return {
      message: "Welcome to undoubt",
      name: savedUser?.name,
    };
  } catch (e) {
    console.log(e);
    return {
      error: "Something went wrong",
    };
  }
}
