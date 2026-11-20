import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { isValidObjectId } from "mongoose";
import { db } from "@/lib/db";
import { fail, json, requireAdmin, sameOrigin } from "@/lib/http";
import { Media, Post } from "@/lib/models";
import { POSTS_TAG, toPostDTO, uniqueSlug } from "@/lib/posts";
import { firstError, postSchema } from "@/lib/validation";

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/admin/posts/[id]">) {
  if (!sameOrigin(req)) return fail("Forbidden", 403);
  if (!(await requireAdmin(req))) return fail("Unauthorized", 401);
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return fail("Post not found", 404);
  const parsed = postSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return fail(firstError(parsed.error));
  const d = parsed.data;
  try {
    await db();
    const post = await Post.findById(id);
    if (!post) return fail("Post not found", 404);
    const oldCover = post.coverId ? String(post.coverId) : "";
    post.set({
      title: d.title,
      category: d.category,
      excerpt: d.excerpt,
      content: d.content,
      coverId: d.coverId || undefined,
      status: d.status,
      slug: d.slug && d.slug !== post.slug ? await uniqueSlug(d.slug, id) : post.slug,
    });
    if (d.status === "published" && !post.publishedAt) post.publishedAt = new Date();
    await post.save();
    if (oldCover && oldCover !== (d.coverId || "")) await Media.findByIdAndDelete(oldCover);
    revalidateTag(POSTS_TAG, { expire: 0 });
    return json({ post: toPostDTO(post.toObject()) });
  } catch (err) {
    console.error("Update post failed", err);
    return fail("Could not save the post.", 500);
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/admin/posts/[id]">) {
  if (!sameOrigin(req)) return fail("Forbidden", 403);
  if (!(await requireAdmin(req))) return fail("Unauthorized", 401);
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return fail("Post not found", 404);
  try {
    await db();
    const post = await Post.findByIdAndDelete(id).lean();
    if (post?.coverId) await Media.findByIdAndDelete(post.coverId);
    revalidateTag(POSTS_TAG, { expire: 0 });
    return json({ ok: true });
  } catch (err) {
    console.error("Delete post failed", err);
    return fail("Could not delete the post.", 500);
  }
}
