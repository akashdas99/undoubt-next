import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const params = request?.nextUrl?.searchParams?.get("keyword");
  const res = await fetch(
    `${process.env.REACT_APP_BACKEND}/search/questions/?q=${params}`
  );
  const data = await res.json();
  return Response.json(data);
}
