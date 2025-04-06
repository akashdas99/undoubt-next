import { getUser } from "@/services/user";

export async function GET() {
  try {
    const profile = await getUser();
    return Response.json(profile);
  } catch (error) {
    return Response.json(error instanceof Error && error?.message, {
      status: 400,
    });
  }
}
