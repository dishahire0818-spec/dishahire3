import { connection } from "next/server";
import mongoose from "mongoose";
import { db } from "@/lib/db";

/**
 * Setup check: open /api/health after deploying. Shows only yes/no flags, never values.
 */
export async function GET() {
  await connection(); // always run at request time
  const env = process.env;
  const settings = {
    MONGODB_URI: Boolean(env.MONGODB_URI || env.MONGO_URI),
    ADMIN_EMAIL: Boolean(env.ADMIN_EMAIL),
    ADMIN_PASSWORD_HASH: /^scrypt:[\w-]+:[\w-]+$/.test(env.ADMIN_PASSWORD_HASH ?? ""),
    JWT_SECRET: (env.JWT_SECRET ?? "").length >= 32,
    NEXT_PUBLIC_SITE_URL: Boolean(env.NEXT_PUBLIC_SITE_URL),
    RESEND_API_KEY_optional: Boolean(env.RESEND_API_KEY),
  };

  let database = "not configured";
  if (settings.MONGODB_URI) {
    try {
      await db();
      await mongoose.connection.db?.admin().ping();
      database = "connected";
    } catch (err) {
      const msg = String((err as Error)?.message ?? "");
      database = /auth|password|credential/i.test(msg)
        ? "error: wrong database username or password"
        : /ENOTFOUND|querySrv|ECONNREFUSED|timed out|Server selection/i.test(msg)
          ? "error: cannot reach cluster (check Network Access allows 0.0.0.0/0 and the connection string)"
          : "error: could not connect";
    }
  }

  const required = ["MONGODB_URI", "ADMIN_EMAIL", "ADMIN_PASSWORD_HASH", "JWT_SECRET", "NEXT_PUBLIC_SITE_URL"] as const;
  const ok = database === "connected" && required.every((k) => settings[k]);
  return Response.json(
    { ok, database, settings, help: ok ? "All good." : "Fix the items marked false or the database error, then redeploy in Vercel." },
    { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
