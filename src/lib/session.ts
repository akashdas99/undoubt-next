import { cookies } from "next/headers";
import { UserType } from "./types";
import jwt from "jsonwebtoken";

export function createSession(tokenData: Partial<UserType>) {
  const token = jwt.sign(tokenData, process.env.SECRET!, {
    expiresIn: "10h",
  });
  cookies().set("token", token, { httpOnly: true });
}
export async function getSession(): Promise<
  (Partial<UserType> & jwt.JwtPayload) | null
> {
  const token = await cookies().get("token")?.value;
  if (!token) return null;
  return jwt.verify(token, process.env.SECRET!) as Partial<UserType>;
}
export async function removeSession() {
  await cookies().delete("token");
}
