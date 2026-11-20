import "server-only";
import type { NextRequest } from "next/server";
import { RateLimit } from "./models";
import { verifySession, SESSION_COOKIE } from "./session";

export const json = (data: unknown, status = 200) => Response.json(data, { status });
export const fail = (error: string, status = 400) => Response.json({ error }, { status });

export function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/** Fixed-window limiter stored in MongoDB, so it works across serverless instances. */
export async function rateLimit(key: string, limit: number, windowSec: number) {
  const now = new Date();
  const doc = await RateLimit.findOneAndUpdate(
    { key, expiresAt: { $gt: now } },
    { $inc: { count: 1 } },
    { new: true },
  ).lean();
  if (doc) return doc.count <= limit;
  try {
    await RateLimit.deleteOne({ key, expiresAt: { $lte: now } });
    await RateLimit.create({ key, count: 1, expiresAt: new Date(now.getTime() + windowSec * 1000) });
  } catch {
    // concurrent create: another request started the window
  }
  return true;
}

export async function requireAdmin(req: NextRequest) {
  return verifySession(req.cookies.get(SESSION_COOKIE)?.value);
}

/** Reject cross-site form posts to cookie-authenticated endpoints. */
export function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}
