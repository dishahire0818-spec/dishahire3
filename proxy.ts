import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// Optimistic gate for the admin area. Every admin API route also re-checks the session.
export async function proxy(req: NextRequest) {
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    return session ? NextResponse.next() : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (pathname === "/admin/login") {
    return session ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.next();
  }
  if (!session) return NextResponse.redirect(new URL("/admin/login", req.url));
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = { matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"] };
