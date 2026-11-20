import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "./db";
import { Post } from "./models";

export const POSTS_TAG = "posts";
export const POST_CATEGORIES = ["Company news", "Hiring tips", "Career advice", "Industry insights"] as const;

export type PostDTO = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverUrl: string | null;
  coverId: string | null;
  status: "draft" | "published";
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
};

type PostDoc = {
  _id: unknown;
  title?: string | null;
  slug?: string | null;
  category?: string | null;
  excerpt?: string | null;
  content?: string | null;
  coverId?: unknown;
  status?: string | null;
  publishedAt?: Date | null;
  updatedAt?: Date | null;
  createdAt?: Date | null;
};

export function toPostDTO(p: PostDoc): PostDTO {
  const coverId = p.coverId ? String(p.coverId) : null;
  return {
    id: String(p._id),
    title: p.title ?? "",
    slug: p.slug ?? "",
    category: p.category || "Company news",
    excerpt: p.excerpt ?? "",
    content: p.content ?? "",
    coverId,
    coverUrl: coverId ? `/api/media/${coverId}` : null,
    status: p.status === "published" ? "published" : "draft",
    publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : null,
    updatedAt: new Date(p.updatedAt ?? p.createdAt ?? 0).toISOString(),
    createdAt: new Date(p.createdAt ?? 0).toISOString(),
  };
}

export function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_-]+/g, "-")
      .slice(0, 80)
      .replace(/^-+|-+$/g, "") || "update"
  );
}

/** Slug that isn't used by another post (adds -2, -3… if needed). Call after db(). */
export async function uniqueSlug(base: string, exceptId?: string) {
  const root = slugify(base);
  let slug = root;
  for (let i = 2; await Post.exists({ slug, ...(exceptId ? { _id: { $ne: exceptId } } : {}) }); i++) slug = `${root}-${i}`;
  return slug;
}

export async function getPublishedPosts(): Promise<PostDTO[]> {
  "use cache";
  cacheTag(POSTS_TAG);
  cacheLife("hours");
  try {
    await db();
    const posts = await Post.find({ status: "published" }).sort({ publishedAt: -1 }).limit(200).lean();
    return posts.map((p) => toPostDTO(p as PostDoc));
  } catch (err) {
    console.error("getPublishedPosts failed", err);
    cacheLife("seconds");
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<PostDTO | null> {
  "use cache";
  cacheTag(POSTS_TAG);
  cacheLife("hours");
  try {
    await db();
    const post = await Post.findOne({ slug, status: "published" }).lean();
    return post ? toPostDTO(post as PostDoc) : null;
  } catch (err) {
    console.error("getPostBySlug failed", err);
    cacheLife("seconds");
    return null;
  }
}
