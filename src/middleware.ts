import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

const PROTECTED_ROUTES = ["/question", "/profile"];
export async function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: ${
    process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`
  };
    style-src 'self' 'unsafe-inline' ;
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    connect-src 'self' ${process.env.NEXT_PUBLIC_BASEURL} *.amazonaws.com;
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  //create response based on request path
  const response = await createResponse(request, nonce);

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

const createResponse = async (request: NextRequest, nonce: string) => {
  const { pathname } = request.nextUrl;

  if (PROTECTED_ROUTES.includes(pathname)) {
    const session = await getSession();

    if (!session) {
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
