"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import type { JobDTO } from "@/lib/types";
import { JobRow } from "./JobRow";
import { btn, cn } from "./ui";

function postedLabel(iso: string) {
  const days = Math.floor((Date.now() - Date.parse(iso)) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function tally(jobs: JobDTO[], key: "industry" | "employmentType") {
  const m: Record<string, number> = {};
  for (const j of jobs) m[j[key]] = (m[j[key]] ?? 0) + 1;
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}

function Option({ active, label, n, onClick }: { active: boolean; label: string; n: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors",
        active ? "bg-brand-900 text-white" : "text-brand-900 hover:bg-cream",
      )}
    >
      <span className="truncate">{label}</span>
      <span className={cn("rounded-full px-2 text-xs tabular-nums", active ? "bg-white/15" : "bg-cream text-muted")}>{n}</span>
    </button>
  )
}

export function JobBoard({ jobs }: { jobs: JobDTO[] }) {
  const params = useSearchParams();
  const [q, setQ] = useState([params.get("q"), params.get("loc")].filter(Boolean).join(" "));
  const [industry, setIndustry] = useState(params.get("industry") ?? "All");
  const [type, setType] = useState(params.get("type") ?? "All");

  const industries = useMemo(() => tally(jobs, "industry"), [jobs]);
  const types = useMemo(() => tally(jobs, "employmentType"), [jobs]);

  const sync = (next: { q?: string; industry?: string; type?: string }) => {
    const v = { q, industry, type, ...next };
    const sp = new URLSearchParams();
    if (v.q) sp.set("q", v.q);
    if (v.industry !== "All") sp.set("industry", v.industry);
    if (v.type !== "All") sp.set("type", v.type);
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  };

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return jobs.filter((j) => {
      const hay = `${j.title} ${j.industry} ${j.location} ${j.education} ${j.otherInfo} ${j.experience} ${j.department} ${j.skills} ${j.jobCode}`.toLowerCase();
      return terms.every((t) => hay.includes(t)) && (industry === "All" || j.industry === industry) && (type === "All" || j.employmentType === type);
    });
  }, [jobs, q, industry, type]);

  const filtered = Boolean(q) || industry !== "All" || type !== "All";
  const reset = () => {
    setQ("");
    setIndustry("All");
    setType("All");
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-10">
      {/* Filters */}
      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-line bg-white p-3">
          <p className="px-3 pt-2 pb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted">Industry</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 lg:block lg:space-y-0.5 lg:overflow-visible">
            <Option active={industry === "All"} label="All industries" n={jobs.length} onClick={() => { setIndustry("All"); sync({ industry: "All" }); }} />
            {industries.map(([name, n]) => (
              <Option key={name} active={industry === name} label={name} n={n} onClick={() => { setIndustry(name); sync({ industry: name }); }} />
            ))}
          </div>
          {types.length > 1 && (
            <>
              <p className="mt-3 border-t border-line px-3 pt-4 pb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted">Job type</p>
              <div className="flex flex-wrap gap-2 px-3 pb-2">
                {[["All", jobs.length] as [string, number], ...types].map(([name]) => (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={type === name}
                    onClick={() => { setType(name); sync({ type: name }); }}
                    className={cn("rounded-full border px-3 py-1 text-xs", type === name ? "border-brand-900 bg-brand-900 text-white" : "border-line text-brand-900 hover:border-brand-900")}
                  >
                    {name === "All" ? "Any" : name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="hidden rounded-2xl bg-gold-100 p-6 lg:block">
          <p className="font-display text-2xl leading-tight text-brand-900">Can&apos;t find your role?</p>
          <p className="mt-2 text-sm text-brand-900/70">Share your profile and we&apos;ll match you with upcoming openings, free.</p>
          <Link href="/contact?type=candidate" className={cn(btn.dark, "mt-5 w-full")}>Submit resume</Link>
        </div>
      </aside>

      {/* Results */}
      <div className="min-w-0">
        <label className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 shadow-[0_14px_40px_-30px_rgba(16,56,56,.5)] focus-within:border-brand-900">
          <Search size={18} className="shrink-0 text-muted" aria-hidden />
          <span className="sr-only">Search jobs</span>
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); sync({ q: e.target.value }); }}
            placeholder="Search by title, skill or city…"
            className="min-w-0 flex-1 bg-transparent py-4 text-base text-brand-900 outline-none placeholder:text-muted"
          />
          {q && (
            <button type="button" onClick={() => { setQ(""); sync({ q: "" }); }} aria-label="Clear search" className="rounded-full p-1 text-muted hover:text-brand-900">
              <X size={16} />
            </button>
          )}
        </label>

        <div className="mt-6 mb-4 flex items-center justify-between gap-4 text-sm">
          <p aria-live="polite" className="text-muted">
            <span className="font-medium text-brand-900">{results.length}</span> {results.length === 1 ? "opening" : "openings"}
            {filtered ? " match your filters" : ""}
          </p>
          {filtered && <button type="button" onClick={reset} className="font-medium text-gold-700 hover:text-brand-900">Clear all</button>}
        </div>

        {results.length > 0 ? (
          <div className="grid gap-3">
            {results.map((j) => (
              <JobRow key={j.id} job={j} meta={postedLabel(j.createdAt)} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-brand-900/20 bg-cream px-6 py-14 text-center">
            <p className="font-display text-3xl text-brand-900">{jobs.length ? "No jobs match your search" : "No openings right now"}</p>
            <p className="mx-auto mt-2 max-w-md text-muted">
              {jobs.length ? "Try a different keyword or clear the filters." : "New roles are added every week."} Share your profile and we&apos;ll contact you when a matching role opens.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact?type=candidate" className={btn.dark}>Submit your resume <ArrowRight size={16} /></Link>
              {filtered && <button type="button" onClick={reset} className={btn.outline}>Clear filters</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
