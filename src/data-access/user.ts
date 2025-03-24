import dbConnect from "@/lib/dbConnect";
import { pick } from "@/lib/functions";
import { getSession } from "@/lib/session";
import UserModel from "@/models/user";

export async function getUser() {
  const session = await getSession();
  if (!session) throw new Error("Page not available");

  try {
    await dbConnect();
    const user = await UserModel.findById(session?.id).lean();
    if (!user) throw new Error("User not available");

    return pick(user, [
      "name",
      "username",
      "profession",
      "city",
      "country",
      "_id",
      "createdAt",
      "profilePicture",
    ]);
  } catch (error) {
    throw new Error("Page not available");
  }
}
