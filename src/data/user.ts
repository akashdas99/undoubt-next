import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema/users";
import { getSession } from "@/lib/session";

export async function getProfile() {
  const session = await getSession();
  if (!session?.id) {
    throw new Error("Session not found");
  }

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      userName: users.userName,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, session.id))
    .limit(1);

  if (!user) {
    throw new Error("User not available");
  }

  return user;
}
