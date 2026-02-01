import { getProfile } from "@/data/user";
import { withTryCatch } from "@/lib/utils";

export async function GET() {
  const { result, error } = await withTryCatch(getProfile());
  if (result) return Response.json(result);
  else return Response.json(error, { status: 400 });
}
