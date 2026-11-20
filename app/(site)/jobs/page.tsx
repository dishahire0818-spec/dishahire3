import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { JobBoard } from "@/components/JobBoard";
import { JobRowSkeleton } from "@/components/JobRow";
import { getOpenJobs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Current Job Openings",
  description:
    "Browse current job openings from DishaHire across IT, BFSI, healthcare, manufacturing, sales and more. Apply online with your resume, free for candidates.",
  alternates: { canonical: "/jobs" },
};

export default function JobsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div className="container-page relative py-16 sm:py-20">
          <nav aria-label="Breadcrumb" className="enter text-sm text-white/60">
            <Link href="/" className="hover:text-white">Home</Link> <span className="mx-1.5">/</span> <span className="text-white">Jobs</span>
          </nav>
          <h1 className="enter mt-5 max-w-3xl text-5xl leading-[1.02] sm:text-7xl" style={{ animationDelay: "80ms" }}>
            Find a role that moves you <span className="text-shine-light">forward</span>
          </h1>
          <p className="enter mt-5 max-w-xl text-white/70 sm:text-lg" style={{ animationDelay: "160ms" }}>
            Curated openings from our client companies. Apply online in two minutes. We never charge candidates.
          </p>
        </div>
      </section>
      <section className="container-page py-12 sm:py-16">
        <Suspense
          fallback={
            <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
              <div className="h-72 animate-pulse rounded-2xl bg-cream" />
              <div className="grid content-start gap-3"><JobRowSkeleton /><JobRowSkeleton /><JobRowSkeleton /></div>
            </div>
          }
        >
          <Jobs />
        </Suspense>
      </section>
    </>
  );
}

async function Jobs() {
  return <JobBoard jobs={await getOpenJobs()} />;
}
