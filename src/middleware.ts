import { NextRequest, NextResponse } from "next/server";

async function verifyJwtEdge(token: string, secret: string): Promise<boolean> {
  if (!token || !secret) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [headerB64, payloadB64, signatureB64] = parts;

    // Check payload expiration
    const payloadJson = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson);
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }

    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const b64 = signatureB64.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    const binary = atob(b64 + pad);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return await crypto.subtle.verify("HMAC", key, bytes, data);
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("portfolio_token")?.value;
  const secret = process.env.JWT_SECRET || "";

  const isValidToken = token ? await verifyJwtEdge(token, secret) : false;

  // Protect Admin UI pages (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isValidToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      if (token) {
        response.cookies.delete("portfolio_token");
      }
      return response;
    }
  }

  // Redirect to dashboard if already logged in with VALID token and accessing /admin/login
  if (pathname === "/admin/login" && isValidToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Protect Admin API routes and auth me/logout
  const isProtectedApi =
    pathname.startsWith("/api/admin") ||
    pathname === "/api/auth/me" ||
    pathname === "/api/auth/logout";

  if (isProtectedApi && !isValidToken) {
    const response = NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
    if (token) {
      response.cookies.delete("portfolio_token");
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};