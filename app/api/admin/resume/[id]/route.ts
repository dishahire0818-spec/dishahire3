import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { db } from "@/lib/db";
import { fail, requireAdmin } from "@/lib/http";
import { Resume } from "@/lib/models";

export async function GET(req: NextRequest, ctx: RouteContext<"/api/admin/resume/[id]">) {
  if (!(await requireAdmin(req))) return fail("Unauthorized", 401);
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return fail("Not found", 404);
  await db();
  const file = await Resume.findById(id).lean();
  if (!file) return fail("Not found", 404);
  const data = file.data as unknown as { buffer?: ArrayBuffer } | Buffer;
  const bytes = Buffer.isBuffer(data) ? data : Buffer.from((data as { buffer: ArrayBuffer }).buffer);
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(file.filename)}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
