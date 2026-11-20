import type { Metadata } from "next";
import { Suspense } from "react";
import { JobBoard } from "@/components/JobBoard";
import { JobCardSkeleton } from "@/components/JobCard";
import { PageHero } from "@/components/PageHero";
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
      <PageHero
        eyebrow="Careers"
        title={
          <>
            Find a role that moves you <span className="italic text-gold-700">forward</span>
          </>
        }
        intro="Curated openings from our client companies. Apply online in two minutes. We never charge candidates."
      />
      <section className="container-page -mt-8 pb-24 sm:-mt-10">
        <Suspense
          fallback={
            <div className="mt-24 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <JobCardSkeleton key={i} />
              ))}
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
  const jobs = await getOpenJobs();
  return <JobBoard jobs={jobs} />;
}
