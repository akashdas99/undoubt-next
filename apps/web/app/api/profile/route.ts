import { getProfile } from "@/data/user";

export async function GET() {
  try {
    const profile = await getProfile();
    return Response.json(profile);
  } catch (error) {
    console.log(error);
    return Response.json({});
  }
}
