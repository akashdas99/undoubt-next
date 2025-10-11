import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { UserType } from "./types";

export async function createSession(tokenData: {
  id: string;
  userName: string;
}) {
  const jwtKey = new TextEncoder().encode(process.env.SECRET!);
  const token = await new SignJWT(tokenData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10h")
    .sign(jwtKey);

  (await cookies()).set("token", token, { httpOnly: true });
}
export async function getSession() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  const jwtKey = new TextEncoder().encode(process.env.SECRET!);
  const { payload } = await jwtVerify(token, jwtKey);
  return payload as Partial<UserType & { id: string }>;
}
export async function getSessionToken() {
  const token = (await cookies()).get("token")?.value;
  return token;
}
export async function getSessionFromToken(token: string) {
  const jwtKey = new TextEncoder().encode(process.env.SECRET!);
  const { payload } = await jwtVerify(token, jwtKey);
  return payload as Partial<UserType & { id: string }>;
}
export async function removeSession() {
  (await cookies()).delete("token");
}
