import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PostDTO } from "@/lib/posts";
import { cn } from "./ui";

export const fmtPostDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

/** Cover image, or a branded typographic tile when the post has none. */
export function PostCover({ post, sizes, priority, className }: { post: PostDTO; sizes: string; priority?: boolean; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-brand-900", className)}>
      {post.coverUrl ? (
        <Image src={post.coverUrl} alt="" fill sizes={sizes} priority={priority} unoptimized className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      ) : (
        <div className="absolute inset-0 flex items-end p-6">
          <span className="font-display text-5xl leading-none text-gold-300/90">{post.category}</span>
        </div>
      )}
    </div>
  );
}

export function PostCard({ post, featured }: { post: PostDTO; featured?: boolean }) {
  return (
    <article className={cn("group relative", featured && "grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center")}>
      <PostCover post={post} sizes={featured ? "(min-width:1024px) 55vw, 100vw" : "(min-width:1024px) 30vw, 100vw"} priority={featured} className={cn("rounded-[1.75rem]", featured ? "aspect-[16/10]" : "aspect-[4/3]")} />
      <div className={cn(!featured && "mt-5")}>
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-gold-700">
          {post.category}
          <span className="h-px w-5 bg-line" />
          <span className="text-muted">{fmtPostDate(post.publishedAt)}</span>
        </p>
        <h3 className={cn("mt-3 leading-tight text-brand-900", featured ? "text-4xl sm:text-5xl" : "text-2xl sm:text-[1.7rem]")}>
          <Link href={`/updates/${post.slug}`} className="after:absolute after:inset-0 focus:outline-none">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className={cn("mt-3 text-muted", featured ? "text-lg" : "line-clamp-2")}>{post.excerpt}</p>}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-900">
          Read more <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  );
}
