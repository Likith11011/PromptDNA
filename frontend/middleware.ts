import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = ["/analyze", "/history", "/coaching", "/profile", "/compare"]
const authRoutes = ["/auth/login", "/auth/signup"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("promptdna_token")?.value
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
  const isAuth = authRoutes.some((r) => pathname.startsWith(r))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (isAuth && token) {
    return NextResponse.redirect(new URL("/analyze", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/analyze/:path*", "/history/:path*", "/coaching/:path*",
    "/profile/:path*", "/compare/:path*", "/auth/:path*"
  ],
}