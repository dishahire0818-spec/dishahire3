import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { fmtPostDate, PostCard, PostCover } from "@/components/PostCard";
import { LinkedInIcon, WhatsAppIcon } from "@/components/ui";
import { readingTime, renderContent } from "@/lib/markdown";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/updates/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Update not found", robots: { index: false } };
  return {
    title: post.title,
    description: post.excerpt || post.content.slice(0, 155),
    alternates: { canonical: `/updates/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.publishedAt ?? undefined,
      ...(post.coverUrl ? { images: [{ url: post.coverUrl }] } : {}),
    },
  };
}

export default function UpdatePage(props: PageProps<"/updates/[slug]">) {
  return (
    <Suspense fallback={<div className="container-page min-h-[70vh] py-24" aria-busy />}>
      <Article params={props.params} />
    </Suspense>
  );
}

async function Article({ params }: { params: PageProps<"/updates/[slug]">["params"] }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const more = (await getPublishedPosts()).filter((p) => p.id !== post.id).slice(0, 3);
  const url = `${SITE.url}/updates/${post.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          ...(post.coverUrl ? { image: `${SITE.url}${post.coverUrl}` } : {}),
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: `${SITE.url}/logo-full.png` } },
          mainEntityOfPage: url,
        }}
      />
      <article>
        <header className="container-page max-w-4xl pt-12 sm:pt-16">
          <Link href="/updates" className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand-900">
            <ArrowLeft size={16} /> All updates
          </Link>
          <p className="mt-8 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-gold-700">
            {post.category}
            <span className="h-px w-5 bg-line" />
            <span className="text-muted">{fmtPostDate(post.publishedAt)}</span>
            <span className="h-px w-5 bg-line" />
            <span className="text-muted">{readingTime(post.content)} min read</span>
          </p>
          <h1 className="mt-5 text-5xl leading-[1.02] text-brand-900 sm:text-6xl">{post.title}</h1>
          {post.excerpt && <p className="mt-6 text-xl leading-relaxed text-muted">{post.excerpt}</p>}
        </header>
        {post.coverUrl && (
          <div className="container-page mt-12 max-w-6xl">
            <PostCover post={post} sizes="(min-width:1280px) 72rem, 100vw" priority className="aspect-[16/8] rounded-[2rem]" />
          </div>
        )}
        <div className="container-page mt-12 grid max-w-4xl gap-10 pb-16 sm:mt-16 lg:grid-cols-[1fr_3rem]">
          <div className="prose-dh" dangerouslySetInnerHTML={{ __html: renderContent(post.content) }} />
          <aside aria-label="Share" className="flex gap-2 lg:sticky lg:top-28 lg:flex-col lg:self-start">
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="grid h-11 w-11 place-items-center rounded-full border border-line text-brand-900 hover:border-brand-900 hover:bg-brand-900 hover:text-white">
              <LinkedInIcon size={16} />
            </a>
            <a href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="grid h-11 w-11 place-items-center rounded-full border border-line text-brand-900 hover:border-brand-900 hover:bg-brand-900 hover:text-white">
              <WhatsAppIcon size={16} />
            </a>
          </aside>
        </div>
      </article>
      {more.length > 0 && (
        <section className="border-t border-line bg-cream py-16 sm:py-20">
          <div className="container-page">
            <h2 className="text-4xl text-brand-900">More updates</h2>
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaSection />
    </>
  );
}
