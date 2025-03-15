import dbConnect from "@/lib/dbConnect";
import { pick } from "@/lib/functions";
import { getSession } from "@/lib/session";
import UserModel from "@/models/user";

dbConnect();

export async function getUser() {
  const session = await getSession();
  if (!session) throw new Error("Page not available");

  try {
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
    ]);
  } catch (error) {
    throw new Error("Page not available");
  }
}
