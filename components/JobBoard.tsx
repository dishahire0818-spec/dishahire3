"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { JobDTO } from "@/lib/types";
import { JobCard } from "./JobCard";
import { btn, cn } from "./ui";

export function JobBoard({ jobs }: { jobs: JobDTO[] }) {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [industry, setIndustry] = useState(params.get("industry") ?? "All");
  const [type, setType] = useState(params.get("type") ?? "All");

  const industries = useMemo(() => ["All", ...Array.from(new Set(jobs.map((j) => j.industry))).sort()], [jobs]);
  const types = useMemo(() => ["All", ...Array.from(new Set(jobs.map((j) => j.employmentType))).sort()], [jobs]);

  const sync = (next: { q?: string; industry?: string; type?: string }) => {
    const sp = new URLSearchParams();
    const v = { q, industry, type, ...next };
    if (v.q) sp.set("q", v.q);
    if (v.industry !== "All") sp.set("industry", v.industry);
    if (v.type !== "All") sp.set("type", v.type);
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  };

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return jobs.filter((j) => {
      const hay = `${j.title} ${j.industry} ${j.location} ${j.education} ${j.otherInfo} ${j.experience}`.toLowerCase();
      return (
        terms.every((t) => hay.includes(t)) &&
        (industry === "All" || j.industry === industry) &&
        (type === "All" || j.employmentType === type)
      );
    });
  }, [jobs, q, industry, type]);

  const filtered = q || industry !== "All" || type !== "All";
  const reset = () => {
    setQ("");
    setIndustry("All");
    setType("All");
    window.history.replaceState(null, "", window.location.pathname);
  };

  const select = "w-full appearance-none rounded-full border border-line bg-white px-4 py-3 text-sm text-brand-900 outline-none focus:border-brand-900";

  return (
    <div>
      <div className="grid gap-3 rounded-[1.75rem] border border-line bg-white p-3 shadow-[0_18px_50px_-30px_rgba(16,56,56,.35)] md:grid-cols-[1fr_15rem_11rem]">
        <label className="flex items-center gap-3 rounded-full bg-cream px-4">
          <Search size={18} className="shrink-0 text-muted" aria-hidden />
          <span className="sr-only">Search jobs</span>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              sync({ q: e.target.value });
            }}
            placeholder="Search by title, skill, city…"
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-brand-900 outline-none placeholder:text-muted"
          />
          {q && (
            <button type="button" onClick={() => { setQ(""); sync({ q: "" }); }} aria-label="Clear search" className="text-muted hover:text-brand-900">
              <X size={16} />
            </button>
          )}
        </label>
        <label>
          <span className="sr-only">Industry</span>
          <select value={industry} onChange={(e) => { setIndustry(e.target.value); sync({ industry: e.target.value }); }} className={select}>
            {industries.map((i) => (
              <option key={i} value={i}>{i === "All" ? "All industries" : i}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Job type</span>
          <select value={type} onChange={(e) => { setType(e.target.value); sync({ type: e.target.value }); }} className={select}>
            {types.map((t) => (
              <option key={t} value={t}>{t === "All" ? "All job types" : t}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 mb-5 flex items-center justify-between gap-4 text-sm text-muted">
        <p aria-live="polite">
          <SlidersHorizontal size={14} className="mr-1.5 inline" />
          {results.length} {results.length === 1 ? "opening" : "openings"}
          {filtered ? " match your search" : ""}
        </p>
        {filtered && (
          <button type="button" onClick={reset} className="font-medium text-gold-700 hover:text-brand-900">
            Clear filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {results.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>
      ) : (
        <div className="rounded-[var(--radius-card)] border border-dashed border-line p-10 text-center">
          <p className="font-display text-2xl text-brand-900">{jobs.length ? "No jobs match your search" : "No openings right now"}</p>
          <p className="mt-2 text-sm text-muted">
            Share your profile and we&apos;ll contact you when a matching role opens.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contact?type=candidate" className={btn.dark}>Submit your resume</Link>
            {filtered && <button type="button" onClick={reset} className={cn(btn.outline)}>Clear filters</button>}
          </div>
        </div>
      )}
    </div>
  );
}
