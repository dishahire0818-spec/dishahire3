import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { clientIp, fail, json, rateLimit, sameOrigin } from "@/lib/http";
import { verifyPassword } from "@/lib/password";
import { createSession, sessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("Forbidden", 403);
  const body = (await req.json().catch(() => ({}))) as { email?: unknown; password?: unknown };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) return fail("Enter your email and password.");

  try {
    await db();
    if (!(await rateLimit(`login:${clientIp(req)}`, 5, 15 * 60))) {
      return fail("Too many attempts. Please wait 15 minutes and try again.", 429);
    }
  } catch (err) {
    console.error("Login rate-limit check failed", err);
    return fail("Service temporarily unavailable.", 503);
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const passwordOk = await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH);
  if (!adminEmail || email !== adminEmail || !passwordOk) return fail("Incorrect email or password.", 401);

  const res = json({ ok: true });
  res.headers.append("Set-Cookie", serialize(sessionCookie(await createSession(email))));
  return res;
}

function serialize(c: ReturnType<typeof sessionCookie>) {
  return [
    `${c.name}=${c.value}`,
    `Path=${c.path}`,
    `Max-Age=${c.maxAge}`,
    "HttpOnly",
    "SameSite=Strict",
    c.secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}
