import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CtaSection } from "@/components/CtaSection";
import { PostCard } from "@/components/PostCard";
import { btn } from "@/components/ui";
import { getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Updates, Hiring Tips & Career Advice",
  description: "News from DishaHire, hiring tips for employers and career advice for job seekers in Gujarat.",
  alternates: { canonical: "/updates" },
};

export default function UpdatesPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="container-page py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="enter text-sm text-muted">
            <Link href="/" className="hover:text-brand-900">Home</Link> <span className="mx-1.5">/</span> <span className="text-brand-900">Updates</span>
          </nav>
          <h1 className="enter mt-6 max-w-3xl text-5xl leading-[0.98] text-brand-900 sm:text-7xl" style={{ animationDelay: "80ms" }}>
            Updates &amp; <span className="text-shine">insights</span>
          </h1>
          <p className="enter mt-6 max-w-xl text-lg text-muted" style={{ animationDelay: "160ms" }}>
            Company news, hiring tips for employers and practical career advice for job seekers.
          </p>
        </div>
      </section>
      <section className="container-page py-14 sm:py-20">
        <Suspense fallback={<div className="aspect-[16/7] animate-pulse rounded-[1.75rem] bg-cream" />}>
          <Posts />
        </Suspense>
      </section>
      <CtaSection />
    </>
  );
}

async function Posts() {
  const posts = await getPublishedPosts();
  if (posts.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-brand-900/20 bg-cream px-6 py-16 text-center">
        <p className="font-display text-3xl text-brand-900">Our first updates are coming soon</p>
        <p className="mx-auto mt-2 max-w-md text-muted">In the meantime, take a look at our current openings.</p>
        <Link href="/jobs" className={`${btn.dark} mt-6`}>Browse jobs</Link>
      </div>
    );
  }
  const [first, ...rest] = posts;
  return (
    <div className="space-y-16">
      <PostCard post={first} featured />
      {rest.length > 0 && (
        <div className="grid gap-x-6 gap-y-14 border-t border-line pt-14 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
