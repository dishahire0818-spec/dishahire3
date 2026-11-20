import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { db } from "@/lib/db";
import { Media } from "@/lib/models";

/** Public images (post covers). Immutable: a new upload always gets a new id. */
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/media/[id]">) {
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return new Response("Not found", { status: 404 });
  try {
    await db();
    const file = await Media.findById(id).lean();
    if (!file) return new Response("Not found", { status: 404 });
    const data = file.data as unknown as Buffer | { buffer: ArrayBuffer };
    const bytes = Buffer.isBuffer(data) ? data : Buffer.from(data.buffer);
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": file.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'",
      },
    });
  } catch (err) {
    console.error("Media fetch failed", err);
    return new Response("Unavailable", { status: 503 });
  }
}
