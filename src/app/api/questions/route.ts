import { getQuestions } from "@/data/question";
import { withTryCatchResponse } from "@/lib/utils";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const keyword = request?.nextUrl?.searchParams?.get("keyword");
  if (!keyword) return Response.json([]);

  const questions = await withTryCatchResponse(getQuestions(keyword));

  return Response.json(questions);
}
