import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = getSessionCookie(request)

  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const isRoot = pathname === "/"
  const isChatRoute = pathname.startsWith("/chat")

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/chat", request.url))
  }

  if (isRoot && session) {
    return NextResponse.redirect(new URL("/chat", request.url))
  }

  if (isRoot || isAuthPage) {
    return NextResponse.next()
  }

  if (isChatRoute && !session) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}