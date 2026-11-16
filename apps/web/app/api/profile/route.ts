import { getProfile } from "@/data/user";
import { withTryCatch } from "@/lib/utils";

export async function GET() {
  const { result } = await withTryCatch(getProfile());
  return Response.json(result ?? null);
}
