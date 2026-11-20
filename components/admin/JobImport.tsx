"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react";
import { INDUSTRIES } from "@/lib/site";
import { FormError, inputCls } from "../forms/fields";
import { btn, cn } from "../ui";

/** Column order of the office Excel sheet (copy the rows and paste them here). */
export const IMPORT_COLUMNS = [
  "Job code",
  "Job title",
  "Openings",
  "Department",
  "Education",
  "Experience",
  "Salary",
  "Location / area",
  "Work mode",
  "Skills",
  "Timing",
  "Gender",
  "Age",
  "Notes",
  "Job description",
  "Company (private)",
];

type Parsed = Record<string, unknown> & { title: string; location: string; salary: string; jobCode: string; openings: number | null; warnings: string[] };

const clean = (s: string | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

function mapGender(s: string) {
  const v = s.toLowerCase();
  if (v.startsWith("f")) return "Female";
  if (v.startsWith("m")) return "Male";
  return "Any";
}
function mapExperience(s: string) {
  const v = s.toLowerCase();
  if (v === "both") return "Freshers & experienced";
  if (v === "fresher" || v === "freshers") return "Freshers";
  return s;
}
function mapWorkMode(s: string) {
  const v = s.toLowerCase().replace("feild", "field");
  if (v.includes("field")) return "Field";
  if (v.includes("remote") || v.includes("home")) return "Remote";
  if (v.includes("office")) return "In office";
  return s;
}

export function parseRows(text: string, city: string, industry: string): Parsed[] {
  const rows = text
    .split(/\r?\n/)
    .map((l) => l.split("\t"))
    .filter((cells) => cells.some((c) => c.trim()));
  if (rows[0] && /title/i.test(rows[0][1] ?? "")) rows.shift(); // header row
  return rows.map((c) => {
    const [code, title, openings, department, education, experience, salary, area, mode, skills, timing, gender, age, notes, description, company] = c.map((x) => clean(x));
    const workMode = mapWorkMode(mode ?? "");
    const cityName = city.split(",")[0].trim().toLowerCase();
    const areaIsField = /f(ie|ei)ld/i.test(area ?? "");
    const location = !area || areaIsField ? city : area.toLowerCase().includes(cityName) ? area : `${area}, ${city}`;
    const n = parseInt(openings ?? "", 10);
    const warnings: string[] = [];
    if (!title) warnings.push("Missing job title");
    if (!salary) warnings.push("No salary, will show 'Not disclosed'");
    if (!area) warnings.push(`No location, using ${city}`);
    return {
      jobCode: code ?? "",
      title: title ?? "",
      openings: Number.isFinite(n) && n > 0 ? n : null,
      department: department ?? "",
      industry,
      education: education || "Not specified",
      experience: mapExperience(experience ?? ""),
      salary: salary || "Not disclosed",
      location,
      workMode,
      employmentType: "Full-time",
      skills: skills ?? "",
      timing: timing ?? "",
      gender: mapGender(gender ?? ""),
      ageRange: age ?? "",
      otherInfo: [description, notes].filter(Boolean).join("\n\n"),
      client: company ?? "",
      warnings,
    };
  });
}

export function JobImport({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [text, setText] = useState("");
  const [city, setCity] = useState("Rajkot, Gujarat");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ created: number; updated: number; errors: { row: number; error: string }[] } | null>(null);
  const rows = useMemo(() => parseRows(text, city, industry), [text, city, industry]);
  const invalid = rows.filter((r) => !r.title).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/jobs/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobs: rows.filter((r) => r.title).map(({ warnings, ...job }) => (void warnings, job)) }),
      });
      const out = await res.json();
      if (!res.ok && !out.errors) throw new Error(out.error || "Import failed");
      setResult(out);
      if (out.created || out.updated) onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const label = "mb-1.5 block text-sm font-medium text-brand-900";
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal aria-labelledby="import-title">
      <div className="mx-auto my-6 w-full max-w-5xl rounded-[1.75rem] bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="import-title" className="text-3xl text-brand-900">Import jobs from Excel</h2>
            <p className="mt-1 text-sm text-muted">Copy the rows from your job sheet and paste them below. Jobs with an existing job code are updated, not duplicated.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-muted hover:bg-cream" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {result ? (
          <div className="space-y-4">
            <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">
              <CheckCircle2 size={18} /> {result.created} new job(s) added, {result.updated} updated. They are live on the website.
            </p>
            {result.errors.length > 0 && (
              <ul className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                {result.errors.map((e) => (
                  <li key={e.row}>Row {e.row}: {e.error}</li>
                ))}
              </ul>
            )}
            <div className="flex justify-end">
              <button type="button" onClick={onClose} className={btn.dark}>Done</button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-xl bg-cream p-4 text-xs leading-relaxed text-muted">
              <span className="font-semibold text-brand-900">Column order:</span> {IMPORT_COLUMNS.map((c, i) => `${i + 1}. ${c}`).join(" · ")}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className={label}>Industry for these jobs</span>
                <select className={cn(inputCls, "appearance-none")} value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </select>
              </label>
              <label>
                <span className={label}>City (added to each location)</span>
                <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} />
              </label>
            </div>
            <label className="block">
              <span className={label}>Paste rows here</span>
              <textarea className={cn(inputCls, "min-h-40 font-mono text-xs")} value={text} onChange={(e) => setText(e.target.value)} placeholder={"JD59\tTelecaller\t4\tSales\tGraduate\tBoth\t10k to 15k + incentive\tAmin Marg\tIn office\t..."} />
            </label>

            {rows.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-cream text-xs text-muted">
                    <tr>
                      {["Code", "Title", "Openings", "Location", "Salary", "Experience", "Mode", "Notes"].map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {rows.map((r, i) => (
                      <tr key={i} className={cn(!r.title && "bg-red-50")}>
                        <td className="px-3 py-2 text-muted">{r.jobCode}</td>
                        <td className="px-3 py-2 font-medium text-brand-900">{r.title || "-"}</td>
                        <td className="px-3 py-2">{r.openings ?? "-"}</td>
                        <td className="px-3 py-2">{r.location}</td>
                        <td className="px-3 py-2">{r.salary}</td>
                        <td className="px-3 py-2">{String(r.experience || "-")}</td>
                        <td className="px-3 py-2">{String(r.workMode || "-")}</td>
                        <td className="px-3 py-2 text-xs text-amber-700">
                          {r.warnings.map((w) => (
                            <span key={w} className="flex items-center gap-1"><AlertTriangle size={12} /> {w}</span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <FormError>{error}</FormError>
            <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-end">
              {invalid > 0 && <span className="text-sm text-red-700 sm:mr-auto">{invalid} row(s) without a job title will be skipped.</span>}
              <button type="button" onClick={onClose} className={btn.outline}>Cancel</button>
              <button type="button" disabled={busy || rows.length - invalid === 0} onClick={submit} className={btn.dark}>
                {busy && <Loader2 size={16} className="animate-spin" />} Import {rows.length - invalid} job(s)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
