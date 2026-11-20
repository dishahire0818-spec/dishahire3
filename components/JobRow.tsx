import Link from "next/link";
import { ArrowUpRight, Banknote, Briefcase, GraduationCap, MapPin } from "lucide-react";
import type { JobDTO } from "@/lib/types";

const initials = (s: string) =>
  s
    .replace(/\(.*\)/, "")
    .split(/[\s&,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** Scannable list-style job card used on the home page and job board. */
export function JobRow({ job, meta }: { job: JobDTO; meta?: string }) {
  return (
    <article className="group relative grid gap-4 rounded-2xl border border-line bg-white p-5 transition-all hover:border-brand-900/40 hover:shadow-[0_20px_45px_-30px_rgba(16,56,56,.5)] sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6 sm:p-6">
      <span className="hidden h-14 w-14 place-items-center rounded-2xl bg-brand-900 font-display text-xl text-gold-300 sm:grid" aria-hidden>
        {initials(job.industry)}
      </span>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-gold-700">
          {job.industry}
          {job.openings && <span className="rounded-full bg-brand-50 px-2 py-0.5 tracking-normal normal-case text-brand-800">{job.openings} openings</span>}
        </p>
        <h3 className="mt-1.5 font-display text-2xl leading-tight text-brand-900 sm:text-[1.7rem]">
          <Link href={`/jobs/${job.id}`} className="after:absolute after:inset-0 after:rounded-2xl focus:outline-none">
            {job.title}
          </Link>
        </h3>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
          <li className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-gold-700" />{job.location}</li>
          <li className="inline-flex items-center gap-1.5"><Briefcase size={14} className="text-gold-700" />{job.workMode ? `${job.workMode} · ` : ""}{job.experience || job.employmentType}</li>
          <li className="inline-flex items-center gap-1.5"><GraduationCap size={14} className="text-gold-700" />{job.education}</li>
        </ul>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-line pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
        <p className="inline-flex items-center gap-1.5 font-medium text-brand-900"><Banknote size={16} className="text-gold-700" />{job.salary}</p>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          {meta}
          <span className="grid h-9 w-9 place-items-center rounded-full border border-line text-brand-900 transition-colors group-hover:border-brand-900 group-hover:bg-brand-900 group-hover:text-white">
            <ArrowUpRight size={16} />
          </span>
        </span>
      </div>
    </article>
  );
}

export function JobRowSkeleton() {
  return <div className="h-32 animate-pulse rounded-2xl border border-line bg-cream" />;
}
