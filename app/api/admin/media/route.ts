import type { NextRequest } from "next/server";
import { fail, json, requireAdmin, sameOrigin } from "@/lib/http";
import { saveImage } from "@/lib/upload";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("Forbidden", 403);
  if (!(await requireAdmin(req))) return fail("Unauthorized", 401);
  const fd = await req.formData().catch(() => null);
  if (!fd) return fail("Invalid upload.");
  try {
    const saved = await saveImage(fd.get("file"));
    if (typeof saved === "string") return fail(saved);
    return json(saved, 201);
  } catch (err) {
    console.error("Image upload failed", err);
    return fail("Could not upload the image.", 500);
  }
}
