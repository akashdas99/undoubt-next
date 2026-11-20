import { NextRequest, NextResponse } from "next/server";
import { apiOrigin } from "./lib/api/request";
import { ACCESS_COOKIE } from "@workspace/constants";

const PROTECTED_ROUTES = ["/question", "/profile"];

export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' ;
    img-src 'self' blob: data: https://*.blob.vercel-storage.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    connect-src 'self' ${process.env.NEXT_PUBLIC_BASEURL} ${apiOrigin()} https://vercel.com *.vercel-storage.com;
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  //create response based on request path
  const response = createResponse(request, nonce);

  //set csp header
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

const createResponse = (request: NextRequest, nonce: string) => {
  const { pathname } = request.nextUrl;

  if (PROTECTED_ROUTES.includes(pathname)) {
    const token = request.cookies.get(ACCESS_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
};
