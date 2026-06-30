import { NextRequest, NextResponse } from "next/server";

export function middleware(
  request: NextRequest
) {
  const pathname =
    request.nextUrl.pathname;

  const isProtected =
    pathname.startsWith(
      "/api/admin"
    ) ||
    pathname === "/api/auth/me" ||
    pathname ===
      "/api/auth/logout";

  if (!isProtected) {
    return NextResponse.next();
  }

  const token =
    request.cookies.get(
      "portfolio_token"
    )?.value;

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};