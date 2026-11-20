import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { fail, json, requireAdmin, sameOrigin } from "@/lib/http";
import { Post } from "@/lib/models";
import { POSTS_TAG, toPostDTO, uniqueSlug } from "@/lib/posts";
import { firstError, postSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("Forbidden", 403);
  if (!(await requireAdmin(req))) return fail("Unauthorized", 401);
  const parsed = postSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return fail(firstError(parsed.error));
  const d = parsed.data;
  try {
    await db();
    const post = await Post.create({
      ...d,
      coverId: d.coverId || undefined,
      slug: await uniqueSlug(d.slug || d.title),
      publishedAt: d.status === "published" ? new Date() : undefined,
    });
    revalidateTag(POSTS_TAG, { expire: 0 });
    return json({ post: toPostDTO(post.toObject()) }, 201);
  } catch (err) {
    console.error("Create post failed", err);
    return fail("Could not save the post.", 500);
  }
}
