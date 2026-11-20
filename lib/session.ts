// Edge-safe session helpers (no database imports): used by proxy.ts and route handlers.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "dh_admin";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error("JWT_SECRET must be set (at least 32 characters)");
  return new TextEncoder().encode(s);
}

export async function createSession(email: string) {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret());
}

export async function verifySession(token: string | undefined | null) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return payload.role === "admin" && payload.sub ? { email: payload.sub } : null;
  } catch {
    return null;
  }
}

export const sessionCookie = (value: string, maxAge = SESSION_MAX_AGE) => ({
  name: SESSION_COOKIE,
  value,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge,
});
