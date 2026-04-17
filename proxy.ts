import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getSessionCookie(request);

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isRoot = pathname === "/";

  if ((isAuthPage) && session) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  if (isAuthPage || (isRoot && !session)) {
    return NextResponse.next();
  }
  
  if( isRoot && session) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  if (pathname.startsWith("/") && !session && !isAuthPage && !isRoot) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
