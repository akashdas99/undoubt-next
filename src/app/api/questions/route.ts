import { getQuestions } from "@/data/question";
import { withTryCatchResponse } from "@/lib/utils";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const keyword = request?.nextUrl?.searchParams?.get("keyword") || "";
  const page = parseInt(request?.nextUrl?.searchParams?.get("page") || "1");
  const limit = parseInt(request?.nextUrl?.searchParams?.get("limit") || "10");

  const result = await withTryCatchResponse(getQuestions(keyword, limit, page));

  return Response.json(result);
}
