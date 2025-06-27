import { getUser } from "@/services/user";

export async function GET() {
  try {
    const profile = await getUser();
    return Response.json(profile);
  } catch (error) {
    console.log(error);
    return Response.json({});
  }
}
