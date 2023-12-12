import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // session varsa ve / sayfasına gidiyorsa /app sayfasına yönlendir
  if (
    pathname === "/" &&
    (request.cookies.get("next-auth.session-token") ??
      request.cookies.get("__Secure-next-auth.session-token"))
  ) {
    request.nextUrl.pathname = "/app";
    return NextResponse.redirect(request.nextUrl.toString());
    // return NextResponse.rewrite(new URL("/app", request.url));
  }

  if (
    pathname.startsWith("/app") &&
    !request.cookies.get("next-auth.session-token") &&
    !request.cookies.get("__Secure-next-auth.session-token")
  ) {
    request.nextUrl.pathname = "/";
    return NextResponse.redirect(request.nextUrl.toString());
    // return NextResponse.rewrite(new URL("/", request.url));
  }
}
