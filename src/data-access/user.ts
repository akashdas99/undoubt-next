import { pick } from "@/lib/functions";
import { getSession } from "@/lib/session";
import UserModel from "@/models/user";

export async function getUser() {
  const session = await getSession();
  if (!session) return new Error("Page not available");
  try {
    const user = await UserModel.findById(session?.id).lean();
    if (!user) return new Error("User not available");

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
    return new Error("Page not available");
  }
}
