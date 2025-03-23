import mongoose, { Schema, Document } from "mongoose";
import { UserType } from "@/lib/types";

export interface User extends UserType, Document {
  createdAt: Date;
  profilePicture: string;
}

const userSchema: Schema<User> = new Schema(
  {
    name: {
      type: String,
      maxlength: 40,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    profilePicture: {
      type: String,
    },
  },
  { timestamps: true }
);
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);
export default UserModel;
