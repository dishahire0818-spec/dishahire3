import Link from "next/link";
import { ArrowUpRight, Banknote, Briefcase, GraduationCap, MapPin } from "lucide-react";
import type { JobDTO } from "@/lib/types";

export function postedLabel(iso: string) {
  const days = Math.floor((Date.parse(new Date().toISOString().slice(0, 10)) - Date.parse(iso.slice(0, 10))) / 86400000);
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 30) return `Posted ${days} days ago`;
  return `Posted ${new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
}

export function JobCard({ job, showPosted = true }: { job: JobDTO; showPosted?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-900/30 hover:shadow-[0_18px_40px_-24px_rgba(16,56,56,.45)]">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800">{job.industry}</span>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-brand-900 transition-colors group-hover:border-brand-900 group-hover:bg-brand-900 group-hover:text-white">
          <ArrowUpRight size={16} />
        </span>
      </div>
      <h3 className="mt-5 font-display text-2xl leading-tight text-brand-900">
        <Link href={`/jobs/${job.id}`} className="after:absolute after:inset-0 focus:outline-none">
          {job.title}
        </Link>
      </h3>
      <ul className="mt-4 grid gap-2 text-sm text-muted">
        <li className="flex items-center gap-2">
          <MapPin size={15} className="shrink-0 text-gold-700" /> {job.location}
        </li>
        <li className="flex items-center gap-2">
          <GraduationCap size={15} className="shrink-0 text-gold-700" /> {job.education}
        </li>
        <li className="flex items-center gap-2">
          <Briefcase size={15} className="shrink-0 text-gold-700" /> {job.employmentType}
          {job.experience ? ` · ${job.experience}` : ""}
        </li>
      </ul>
      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
        <p className="flex items-center gap-2 font-medium text-brand-900">
          <Banknote size={16} className="text-gold-700" /> {job.salary}
        </p>
        {showPosted && <p className="text-xs text-muted">{postedLabel(job.createdAt)}</p>}
      </div>
    </article>
  );
}

export function JobCardSkeleton() {
  return <div className="h-64 animate-pulse rounded-[var(--radius-card)] border border-line bg-cream" />;
}
