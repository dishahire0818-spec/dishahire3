"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Archive,
  ArchiveRestore,
  Briefcase,
  Building2,
  Download,
  ExternalLink,
  FileText,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Newspaper,
  Mail,
  Menu,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import type { PostDTO } from "@/lib/posts";
import type { SiteSettings } from "@/lib/settings";
import type { JobDTO } from "@/lib/types";
import { Logo } from "../Logo";
import { btn, cn } from "../ui";
import { JobEditor } from "./JobEditor";
import { JobImport } from "./JobImport";
import { Notes, stageField, StagePicker, stagesFor, type Note } from "./Pipeline";
import { PostEditor, PostsPanel } from "./PostsPanel";
import { SettingsPanel } from "./SettingsPanel";

type Row = Record<string, string | undefined> & { id: string; createdAt: string };
type Data = { jobs: JobDTO[]; companies: Row[]; candidates: Row[]; applications: Row[]; posts: PostDTO[]; settings: SiteSettings; loadedAt: number };
type Kind = "company" | "candidate" | "application";
const notesOf = (r: Row) => ((r as unknown as { notes?: Note[] }).notes ?? []);
type Tab = "overview" | "jobs" | "applications" | "companies" | "candidates" | "posts" | "content";

const TABS: { id: Tab; label: string; icon: typeof Briefcase }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "companies", label: "Employer enquiries", icon: Building2 },
  { id: "candidates", label: "Candidate profiles", icon: UserRound },
  { id: "posts", label: "Updates", icon: Newspaper },
  { id: "content", label: "Website content", icon: Settings2 },
];

export const fmtDate = (iso: string, time = false) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
  });

function downloadCsv(name: string, rows: Row[], cols: [string, string][]) {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.map(([, h]) => esc(h)).join(","), ...rows.map((r) => cols.map(([k]) => esc(k === "createdAt" ? fmtDate(r[k] as string, true) : r[k])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: `${name}-${new Date().toISOString().slice(0, 10)}.csv` });
  a.click();
  URL.revokeObjectURL(url);
}

const matches = (q: string, ...fields: (string | undefined)[]) => {
  const t = q.trim().toLowerCase();
  return !t || fields.some((f) => f?.toLowerCase().includes(t));
};

export function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState(false);
  const [editing, setEditing] = useState<JobDTO | "new" | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [jobFilter, setJobFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [editingPost, setEditingPost] = useState<PostDTO | "new" | null>(null);
  const [importing, setImporting] = useState(false);

  const fetchData = useCallback(async (): Promise<Data | null> => {
    const res = await fetch("/api/admin/data", { cache: "no-store" });
    if (res.status === 401) {
      router.replace("/admin/login");
      return null;
    }
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || "Failed to load data");
    return { ...body, loadedAt: Date.now() };
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const d = await fetchData();
      if (d) setData(d);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData()
      .then((d) => d && setData(d))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [fetchData]);

  const go = (t: Tab) => {
    setTab(t);
    setQuery("");
    setStageFilter("all");
    setMenu(false);
  };

  async function call(url: string, method: string, body?: unknown) {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) router.replace("/admin/login");
    const out = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(out.error || "Request failed");
    return out;
  }

  async function removeRecord(kind: "company" | "candidate" | "application", id: string, label: string) {
    if (!confirm(`Permanently delete ${label}? This also deletes any attached resume.`)) return;
    try {
      await call(`/api/admin/records/${kind}/${id}`, "DELETE");
      await load();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  /** Pipeline change on one record; updates it in place without reloading everything. */
  async function patchRecord(kind: Kind, id: string, body: Record<string, string>) {
    try {
      const out = (await call(`/api/admin/records/${kind}/${id}`, "PATCH", body)) as { record: Row };
      const key = kind === "company" ? "companies" : kind === "candidate" ? "candidates" : "applications";
      setData((d) => (d ? { ...d, [key]: d[key].map((r) => (r.id === id ? out.record : r)) } : d));
    } catch (err) {
      alert((err as Error).message);
      throw err;
    }
  }

  const byStage = (kind: Kind, rows: Row[]) =>
    stageFilter === "all" ? rows : rows.filter((r) => (r[stageField(kind)] ?? "new") === stageFilter);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  const appCount = useMemo(() => {
    const m = new Map<string, number>();
    data?.applications.forEach((a) => m.set(a.jobId!, (m.get(a.jobId!) ?? 0) + 1));
    return m;
  }, [data]);

  const current = TABS.find((t) => t.id === tab)!;

  return (
    <div className="flex min-h-dvh">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-brand-900 p-5 text-white transition-transform lg:translate-x-0",
          menu ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Logo light />
          <button type="button" className="p-1 lg:hidden" onClick={() => setMenu(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>
        <nav className="mt-10 space-y-1" aria-label="Admin">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => go(id)}
              aria-current={tab === id ? "page" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                tab === id ? "bg-gold-500 font-medium text-brand-950" : "text-white/75 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon size={17} /> {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-1 border-t border-white/10 pt-4 text-sm">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/75 hover:bg-white/10 hover:text-white">
            <ExternalLink size={17} /> View website
          </Link>
          <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-white/75 hover:bg-white/10 hover:text-white">
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>
      {menu && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setMenu(false)} />}

      <main className="min-w-0 flex-1 p-4 sm:p-8 lg:ml-64">
        <header className="mb-6 flex flex-wrap items-center gap-3">
          <button type="button" className="rounded-xl bg-white p-2.5 shadow-sm lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <h1 className="mr-auto text-3xl text-brand-900 sm:text-4xl">{current.label}</h1>
          <button type="button" onClick={load} className={cn(btn.outline, "bg-white")} disabled={loading}>
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          {tab === "jobs" && (
            <>
              <button type="button" onClick={() => setImporting(true)} className={cn(btn.outline, "bg-white")}>
                <Upload size={16} /> Import from Excel
              </button>
              <button type="button" onClick={() => setEditing("new")} className={btn.dark}>
                <Plus size={16} /> Post a job
              </button>
            </>
          )}
          {tab === "posts" && (
            <button type="button" onClick={() => setEditingPost("new")} className={btn.dark}>
              <Plus size={16} /> New update
            </button>
          )}
        </header>

        {error && (
          <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
        )}

        {!data ? (
          <div className="grid h-64 place-items-center text-muted">
            {loading ? <Loader2 className="animate-spin" /> : "No data"}
          </div>
        ) : (
          <>
            {tab !== "overview" && tab !== "content" && (
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <label className="flex min-w-60 flex-1 items-center gap-2 rounded-xl border border-line bg-white px-3">
                  <Search size={16} className="text-muted" />
                  <span className="sr-only">Search</span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search…"
                    className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
                  />
                </label>
                {tab === "jobs" && (
                  <label className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm">
                    <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
                    Show archived
                  </label>
                )}
                {tab === "applications" && (
                  <select
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                    className="rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
                    aria-label="Filter by job"
                  >
                    <option value="all">All jobs</option>
                    {data.jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title}, {j.location}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {(tab === "applications" || tab === "candidates" || tab === "companies") && (
              <StageFilter
                kind={tab === "companies" ? "company" : tab === "candidates" ? "candidate" : "application"}
                rows={tab === "companies" ? data.companies : tab === "candidates" ? data.candidates : data.applications.filter((r) => jobFilter === "all" || r.jobId === jobFilter)}
                value={stageFilter}
                onChange={setStageFilter}
              />
            )}

            {tab === "overview" && <Overview data={data} go={go} />}

            {tab === "posts" && <PostsPanel posts={data.posts} query={query} call={call} onChanged={load} onEdit={(p) => setEditingPost(p)} />}

            {tab === "content" && (
              <SettingsPanel initial={data.settings} call={call} onSaved={(next) => setData((d) => (d ? { ...d, settings: next } : d))} />
            )}

            {tab === "jobs" && (
              <JobsTable
                jobs={data.jobs.filter((j) => (showArchived || !j.isArchived) && matches(query, j.title, j.location, j.industry, j.jobCode, j.client))}
                appCount={appCount}
                onEdit={(j) => setEditing(j)}
                onArchive={async (j) => {
                  try {
                    await call(`/api/admin/jobs/${j.id}`, "PATCH", { isArchived: !j.isArchived });
                    await load();
                  } catch (err) {
                    alert((err as Error).message);
                  }
                }}
                onDelete={async (j) => {
                  if (!confirm(`Delete "${j.title}" permanently? Consider archiving instead.`)) return;
                  try {
                    await call(`/api/admin/jobs/${j.id}`, "DELETE");
                    await load();
                  } catch (err) {
                    alert((err as Error).message);
                  }
                }}
                onViewApps={(j) => {
                  setJobFilter(j.id);
                  go("applications");
                }}
              />
            )}

            {tab === "applications" && (
              <Records
                rows={byStage("application", data.applications.filter(
                  (r) => (jobFilter === "all" || r.jobId === jobFilter) && matches(query, r.name, r.email, r.jobTitle, r.location, r.mobile),
                ))}
                empty="No applications yet."
                csv={["applications", [["createdAt", "Date"], ["stage", "Stage"], ["jobTitle", "Job"], ["name", "Name"], ["email", "Email"], ["mobile", "Mobile"], ["location", "City"], ["experience", "Experience"], ["noticePeriod", "Notice period"], ["message", "Message"]]]}
                render={(r) => (
                  <RecordCard
                    key={r.id}
                    title={r.name!}
                    subtitle={`Applied for ${r.jobTitle}`}
                    date={r.createdAt}
                    email={r.email}
                    phone={r.mobile}
                    resumeId={r.resumeId}
                    onDelete={() => removeRecord("application", r.id, `${r.name}'s application`)}
                    pipeline={{ kind: "application", value: r.stage ?? "new", notes: notesOf(r), onPatch: (b) => patchRecord("application", r.id, b) }}
                    fields={[
                      ["City", r.location],
                      ["Experience", r.experience],
                      ["Notice period", r.noticePeriod],
                    ]}
                    note={r.message}
                  />
                )}
              />
            )}

            {tab === "companies" && (
              <Records
                rows={byStage("company", data.companies.filter((r) => matches(query, r.companyName, r.contactName, r.email, r.industry, r.address)))}
                empty="No employer enquiries yet."
                csv={["employer-enquiries", [["createdAt", "Date"], ["status", "Status"], ["companyName", "Company"], ["companyType", "Type"], ["industry", "Industry"], ["address", "Location"], ["contactName", "Contact"], ["designation", "Designation"], ["email", "Email"], ["mobile", "Mobile"], ["alternateNumber", "Alternate"], ["website", "Website"], ["requirement", "Requirement"]]]}
                render={(r) => (
                  <RecordCard
                    key={r.id}
                    title={r.companyName!}
                    subtitle={[r.companyType, r.industry].filter(Boolean).join(" · ")}
                    date={r.createdAt}
                    email={r.email}
                    phone={r.mobile}
                    onDelete={() => removeRecord("company", r.id, `the enquiry from ${r.companyName}`)}
                    pipeline={{ kind: "company", value: r.status ?? "new", notes: notesOf(r), onPatch: (b) => patchRecord("company", r.id, b) }}
                    fields={[
                      ["Contact", [r.contactName, r.designation].filter(Boolean).join(", ")],
                      ["Location", r.address],
                      ["Alternate no.", r.alternateNumber],
                      ["Website", r.website],
                    ]}
                    note={r.requirement}
                  />
                )}
              />
            )}

            {tab === "candidates" && (
              <Records
                rows={byStage("candidate", data.candidates.filter((r) => matches(query, r.name, r.email, r.preferredRole, r.qualification, r.location, r.mobile)))}
                empty="No candidate profiles yet."
                csv={["candidates", [["createdAt", "Date"], ["stage", "Stage"], ["name", "Name"], ["email", "Email"], ["mobile", "Mobile"], ["location", "City"], ["qualification", "Qualification"], ["passingYear", "Passing year"], ["preferredRole", "Preferred role"], ["preferredIndustry", "Preferred industry"], ["experience", "Experience"], ["noticePeriod", "Notice period"], ["expectedSalary", "Expected salary"], ["dob", "Date of birth"]]]}
                render={(r) => (
                  <RecordCard
                    key={r.id}
                    title={r.name!}
                    subtitle={`${r.preferredRole}${r.preferredIndustry ? ` · ${r.preferredIndustry}` : ""}`}
                    date={r.createdAt}
                    email={r.email}
                    phone={r.mobile}
                    resumeId={r.resumeId}
                    onDelete={() => removeRecord("candidate", r.id, `${r.name}'s profile`)}
                    pipeline={{ kind: "candidate", value: r.stage ?? "new", notes: notesOf(r), onPatch: (b) => patchRecord("candidate", r.id, b) }}
                    fields={[
                      ["City", r.location],
                      ["Education", r.qualification ? `${r.qualification} (${r.passingYear})` : undefined],
                      ["Experience", r.experience],
                      ["Notice period", r.noticePeriod],
                      ["Expected salary", r.expectedSalary],
                      ["Date of birth", r.dob],
                    ]}
                  />
                )}
              />
            )}
          </>
        )}
      </main>

      {importing && <JobImport onClose={() => setImporting(false)} onDone={load} />}

      {editingPost && (
        <PostEditor
          post={editingPost === "new" ? null : editingPost}
          call={call}
          onClose={() => setEditingPost(null)}
          onSaved={async () => {
            setEditingPost(null);
            await load();
          }}
        />
      )}

      {editing && (
        <JobEditor
          job={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await load();
          }}
          save={(body, id) => call(id ? `/api/admin/jobs/${id}` : "/api/admin/jobs", id ? "PATCH" : "POST", body)}
        />
      )}
    </div>
  );
}

function Overview({ data, go }: { data: Data; go: (t: Tab) => void }) {
  const weekAgo = data.loadedAt - 7 * 86400000;
  const recent = (rows: { createdAt: string }[]) => rows.filter((r) => Date.parse(r.createdAt) > weekAgo).length;
  const tiles = [
    { tab: "jobs" as Tab, label: "Open jobs", value: data.jobs.filter((j) => !j.isArchived).length, sub: `${data.jobs.filter((j) => j.isArchived).length} archived`, icon: Briefcase },
    { tab: "applications" as Tab, label: "Applications", value: data.applications.length, sub: `${recent(data.applications)} this week`, icon: FileText },
    { tab: "companies" as Tab, label: "Employer enquiries", value: data.companies.length, sub: `${recent(data.companies)} this week`, icon: Building2 },
    { tab: "candidates" as Tab, label: "Candidate profiles", value: data.candidates.length, sub: `${recent(data.candidates)} this week`, icon: UserRound },
  ];
  const activity = [
    ...data.applications.map((r) => ({ id: r.id, when: r.createdAt, tab: "applications" as Tab, text: `${r.name} applied for ${r.jobTitle}` })),
    ...data.companies.map((r) => ({ id: r.id, when: r.createdAt, tab: "companies" as Tab, text: `${r.companyName} sent a hiring enquiry` })),
    ...data.candidates.map((r) => ({ id: r.id, when: r.createdAt, tab: "candidates" as Tab, text: `${r.name} submitted a profile (${r.preferredRole})` })),
  ]
    .sort((a, b) => Date.parse(b.when) - Date.parse(a.when))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(({ tab, label, value, sub, icon: Icon }) => (
          <button key={label} type="button" onClick={() => go(tab)} className="rounded-2xl border border-line bg-white p-5 text-left transition-colors hover:border-brand-900">
            <div className="flex items-center justify-between text-muted">
              <span className="text-sm">{label}</span>
              <Icon size={18} className="text-gold-700" />
            </div>
            <p className="mt-3 font-display text-5xl text-brand-900">{value}</p>
            <p className="mt-1 text-xs text-muted">{sub}</p>
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="text-2xl text-brand-900">Candidate pipeline</h2>
        <p className="mt-1 text-sm text-muted">Applications and candidate profiles by stage.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {stagesFor("candidate").map((st) => {
            const n = [...data.applications, ...data.candidates].filter((r) => (r.stage ?? "new") === st.id).length;
            return (
              <button key={st.id} type="button" onClick={() => go("applications")} className={cn("rounded-xl border p-4 text-left", st.tone)}>
                <span className="block font-display text-3xl">{n}</span>
                <span className="text-xs">{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="text-2xl text-brand-900">Recent activity</h2>
        {activity.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Nothing yet. New applications and enquiries will appear here.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {activity.map((a) => (
              <li key={a.tab + a.id}>
                <button type="button" onClick={() => go(a.tab)} className="flex w-full items-center justify-between gap-4 py-3 text-left text-sm hover:text-gold-700">
                  <span className="text-brand-900">{a.text}</span>
                  <span className="shrink-0 text-xs text-muted">{fmtDate(a.when, true)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function JobsTable({
  jobs,
  appCount,
  onEdit,
  onArchive,
  onDelete,
  onViewApps,
}: {
  jobs: JobDTO[];
  appCount: Map<string, number>;
  onEdit: (j: JobDTO) => void;
  onArchive: (j: JobDTO) => void;
  onDelete: (j: JobDTO) => void;
  onViewApps: (j: JobDTO) => void;
}) {
  if (jobs.length === 0) return <Empty>No jobs to show. Click &ldquo;Post a job&rdquo; to add one.</Empty>;
  const iconBtn = "grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:border-brand-900 hover:text-brand-900";
  return (
    <ul className="space-y-3">
      {jobs.map((j) => (
        <li key={j.id} className={cn("flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 md:flex-row md:items-center", j.isArchived && "opacity-60")}>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs text-brand-800">{j.industry}</span>
              {j.isArchived && <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">Archived</span>}
              {j.jobCode && <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">{j.jobCode}</span>}
              {j.openings && <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs text-brand-900">{j.openings} openings</span>}
              {j.client && <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs text-sky-800" title="Private: not shown on the website">Client: {j.client}</span>}
            </div>
            <p className="mt-2 font-display text-2xl text-brand-900">{j.title}</p>
            <p className="mt-1 text-sm text-muted">
              {j.location} · {j.salary} · {j.employmentType} · Posted {fmtDate(j.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onViewApps(j)} className="mr-2 rounded-lg bg-gold-100 px-3 py-2 text-sm text-brand-900 hover:bg-gold-200">
              {appCount.get(j.id) ?? 0} applications
            </button>
            {!j.isArchived && (
              <Link href={`/jobs/${j.id}`} target="_blank" className={iconBtn} title="View on website" aria-label="View on website">
                <ExternalLink size={16} />
              </Link>
            )}
            <button type="button" onClick={() => onEdit(j)} className={iconBtn} title="Edit" aria-label="Edit">
              <Pencil size={16} />
            </button>
            <button type="button" onClick={() => onArchive(j)} className={iconBtn} title={j.isArchived ? "Re-open" : "Archive (hide from website)"} aria-label={j.isArchived ? "Re-open" : "Archive"}>
              {j.isArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
            </button>
            <button type="button" onClick={() => onDelete(j)} className={cn(iconBtn, "hover:border-red-600 hover:text-red-600")} title="Delete" aria-label="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Records({
  rows,
  empty,
  csv,
  render,
}: {
  rows: Row[];
  empty: string;
  csv: [string, [string, string][]];
  render: (r: Row) => ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm text-muted">
        <span>{rows.length} records</span>
        {rows.length > 0 && (
          <button type="button" onClick={() => downloadCsv(csv[0], rows, csv[1])} className="inline-flex items-center gap-1.5 text-gold-700 hover:text-brand-900">
            <Download size={15} /> Export CSV
          </button>
        )}
      </div>
      {rows.length === 0 ? <Empty>{empty}</Empty> : <ul className="space-y-3">{rows.map(render)}</ul>}
    </div>
  );
}

function RecordCard({
  title,
  subtitle,
  date,
  email,
  phone,
  resumeId,
  fields,
  note,
  onDelete,
  pipeline,
}: {
  title: string;
  subtitle?: string;
  date: string;
  email?: string;
  phone?: string;
  resumeId?: string;
  fields: [string, string | undefined][];
  note?: string;
  onDelete: () => void;
  pipeline: { kind: Kind; value: string; notes: Note[]; onPatch: (body: Record<string, string>) => Promise<void> };
}) {
  return (
    <li className="rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <p className="font-display text-2xl text-brand-900">{title}</p>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {email && (
              <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 text-gold-700 hover:underline">
                <Mail size={14} /> {email}
              </a>
            )}
            {phone && (
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 text-gold-700 hover:underline">
                <Phone size={14} /> {phone}
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
          <StagePicker kind={pipeline.kind} value={pipeline.value} onChange={pipeline.onPatch} />
          <span className="text-xs text-muted">{fmtDate(date, true)}</span>
          <div className="flex gap-2">
            {resumeId && (
              <a href={`/api/admin/resume/${resumeId}`} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-900 px-3 py-1.5 text-xs text-white hover:bg-brand-800">
                <Download size={13} /> Resume
              </a>
            )}
            <button type="button" onClick={onDelete} className="rounded-lg border border-line p-1.5 text-muted hover:border-red-600 hover:text-red-600" aria-label="Delete" title="Delete">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
      <dl className="mt-4 grid gap-x-6 gap-y-3 border-t border-line pt-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {fields
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-muted">{k}</dt>
              <dd className="break-words text-brand-900">{v}</dd>
            </div>
          ))}
      </dl>
      {note && <p className="mt-3 rounded-xl bg-cream p-3 text-sm whitespace-pre-line text-brand-900">{note}</p>}
      <Notes notes={pipeline.notes} onPatch={pipeline.onPatch} />
    </li>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-line bg-white p-12 text-center text-sm text-muted">
      <Inbox size={28} className="mb-3 text-gold-700" />
      {children}
    </div>
  );
}

function StageFilter({ kind, rows, value, onChange }: { kind: Kind; rows: Row[]; value: string; onChange: (v: string) => void }) {
  const field = stageField(kind);
  const count = (id: string) => rows.filter((r) => (r[field] ?? "new") === id).length;
  const chip = (active: boolean) =>
    cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors", active ? "border-brand-900 bg-brand-900 text-white" : "border-line bg-white text-brand-900 hover:border-brand-900");
  return (
    <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter by stage">
      <button type="button" className={chip(value === "all")} onClick={() => onChange("all")}>
        All <span className="opacity-60">{rows.length}</span>
      </button>
      {stagesFor(kind).map((st) => (
        <button key={st.id} type="button" className={chip(value === st.id)} onClick={() => onChange(st.id)}>
          {st.label} <span className="opacity-60">{count(st.id)}</span>
        </button>
      ))}
    </div>
  );
}
