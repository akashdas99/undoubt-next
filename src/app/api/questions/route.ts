import { searchQuestions } from "@/services/question";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const keyword = request?.nextUrl?.searchParams?.get("keyword");
  if (!keyword) return Response.json([]);
  const questions = await searchQuestions(keyword);

  return Response.json(questions);
}
