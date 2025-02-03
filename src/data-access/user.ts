import { getSession } from "@/lib/session";

export async function getUser() {
  const session = await getSession();
  if (!session) return new Error("Page not available");
  try {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND}/user/${session?.id}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return new Error("Page not available");
  }
}
