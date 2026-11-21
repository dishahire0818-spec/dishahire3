import { connection } from "next/server";
import mongoose from "mongoose";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

/**
 * Setup check: open /api/health after deploying.
 * Shows only yes/no checks and hints, never secret values.
 */
export async function GET() {
  await connection(); // always run at request time
  const problems: string[] = [];

  // MONGODB_URI
  const rawUri = process.env.MONGODB_URI ?? process.env.MONGO_URI ?? "";
  const uri = env("MONGODB_URI") || env("MONGO_URI");
  if (!uri) problems.push("MONGODB_URI is missing in Vercel.");
  else {
    if (rawUri.trim() !== uri) problems.push("MONGODB_URI had extra text (quotes or 'MONGODB_URI='); it was cleaned automatically, but please fix it in Vercel.");
    if (!/^mongodb(\+srv)?:\/\//.test(uri)) problems.push("MONGODB_URI must start with mongodb+srv://");
    if (/[<>]/.test(uri)) problems.push("MONGODB_URI still contains < or >. Replace <db_password> with the real password (no brackets).");
    if (/\s/.test(uri)) problems.push("MONGODB_URI contains a space.");
    const m = uri.match(/^mongodb(?:\+srv)?:\/\/([^:@/]+)(?::[^@]*)?@([^/?]+)(\/[^?]*)?/);
    if (!m) problems.push("MONGODB_URI format looks wrong. Expected mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/dishahire");
    else if (/YOURCLUSTER|xxxxx/i.test(m[2])) problems.push("MONGODB_URI still has the example cluster name. Copy your real cluster address from MongoDB → Connect.");
  }

  // Admin login settings
  const email = env("ADMIN_EMAIL");
  if (!email) problems.push("ADMIN_EMAIL is missing in Vercel.");
  const hash = env("ADMIN_PASSWORD_HASH");
  if (!hash) problems.push("ADMIN_PASSWORD_HASH is missing in Vercel.");
  else if (!/^scrypt:[\w-]+:[\w-]+$/.test(hash)) problems.push("ADMIN_PASSWORD_HASH looks wrong. It must start with scrypt: and have no spaces.");
  const jwt = env("JWT_SECRET");
  if (!jwt) problems.push("JWT_SECRET is missing in Vercel.");
  else if (jwt.length < 32) problems.push("JWT_SECRET is too short (needs 32+ characters).");

  // Database connection
  let database = "not checked";
  if (uri) {
    try {
      await db();
      await mongoose.connection.db?.admin().ping();
      database = "connected";
    } catch (err) {
      const msg = String((err as Error)?.message ?? "");
      database = /auth|password|credential/i.test(msg)
        ? "error: wrong database username or password in MONGODB_URI"
        : /ENOTFOUND|querySrv|ECONNREFUSED|timed out|Server selection/i.test(msg)
          ? "error: cannot reach the cluster (check MongoDB Network Access allows 0.0.0.0/0, and the cluster address)"
          : "error: could not connect";
      problems.push(`Database: ${database.replace("error: ", "")}.`);
    }
  }

  const mask = (e: string) => e.replace(/^(.{3}).*(@.*)$/, "$1***$2");
  const ok = problems.length === 0 && database === "connected";
  return Response.json(
    {
      ok,
      database,
      admin_email: email ? mask(email) : null,
      problems,
      next_step: ok ? "All good. Log in at /admin." : "Fix the problems listed above in Vercel → Settings → Environment Variables, then Redeploy.",
    },
    { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
