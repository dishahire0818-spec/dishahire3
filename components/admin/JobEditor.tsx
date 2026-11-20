"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { EMPLOYMENT_TYPES, INDUSTRIES } from "@/lib/site";
import type { JobDTO } from "@/lib/types";
import { FormError, inputCls } from "../forms/fields";
import { btn, cn } from "../ui";

const EMPTY = {
  title: "",
  industry: "",
  location: "",
  education: "",
  salary: "",
  gender: "Any",
  employmentType: "Full-time",
  experience: "",
  otherInfo: "",
};

export function JobEditor({
  job,
  onClose,
  onSaved,
  save,
}: {
  job: JobDTO | null;
  onClose: () => void;
  onSaved: () => void;
  save: (body: typeof EMPTY, id?: string) => Promise<unknown>;
}) {
  const [form, setForm] = useState(() => (job ? { ...EMPTY, ...pick(job) } : EMPTY));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const label = "mb-1.5 block text-sm font-medium text-brand-900";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal aria-labelledby="job-editor-title">
      <div className="mx-auto my-6 w-full max-w-2xl rounded-[1.75rem] bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 id="job-editor-title" className="text-3xl text-brand-900">
            {job ? "Edit job" : "Post a new job"}
          </h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-muted hover:bg-cream" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            try {
              await save(form, job?.id);
              onSaved();
            } catch (err) {
              setError((err as Error).message);
              setBusy(false);
            }
          }}
        >
          <label className="sm:col-span-2">
            <span className={label}>Job title *</span>
            <input required maxLength={120} className={inputCls} value={form.title} onChange={set("title")} placeholder="e.g. Sales Executive" />
          </label>
          <label>
            <span className={label}>Industry *</span>
            <select required className={cn(inputCls, "appearance-none")} value={form.industry} onChange={set("industry")}>
              <option value="" disabled>
                Select industry
              </option>
              {[...INDUSTRIES, ...(form.industry && !INDUSTRIES.includes(form.industry) ? [form.industry] : [])].map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </label>
          <label>
            <span className={label}>Location *</span>
            <input required maxLength={120} className={inputCls} value={form.location} onChange={set("location")} placeholder="City, State (e.g. Rajkot, Gujarat)" />
          </label>
          <label>
            <span className={label}>Education *</span>
            <input required maxLength={120} className={inputCls} value={form.education} onChange={set("education")} placeholder="e.g. Any graduate, B.Com" />
          </label>
          <label>
            <span className={label}>Salary *</span>
            <input required maxLength={120} className={inputCls} value={form.salary} onChange={set("salary")} placeholder="e.g. 3-5 LPA or ₹20,000-25,000 per month" />
          </label>
          <label>
            <span className={label}>Job type</span>
            <select className={cn(inputCls, "appearance-none")} value={form.employmentType} onChange={set("employmentType")}>
              {(EMPLOYMENT_TYPES as readonly string[]).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            <span className={label}>Experience</span>
            <input maxLength={60} className={inputCls} value={form.experience} onChange={set("experience")} placeholder="e.g. 1-3 years / Freshers welcome" />
          </label>
          <label>
            <span className={label}>Open to</span>
            <select className={cn(inputCls, "appearance-none")} value={form.gender} onChange={set("gender")}>
              <option value="Any">All candidates</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className={label}>Job description</span>
            <textarea
              rows={6}
              maxLength={5000}
              className={cn(inputCls, "resize-y")}
              value={form.otherInfo}
              onChange={set("otherInfo")}
              placeholder="Responsibilities, skills required, working hours, benefits… (shown on the job page and to Google Jobs)"
            />
          </label>
          <div className="space-y-3 sm:col-span-2">
            <FormError>{error}</FormError>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className={btn.outline}>
                Cancel
              </button>
              <button type="submit" disabled={busy} className={btn.dark}>
                {busy && <Loader2 size={16} className="animate-spin" />}
                {job ? "Save changes" : "Publish job"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function pick(j: JobDTO) {
  return {
    title: j.title,
    industry: j.industry,
    location: j.location,
    education: j.education,
    salary: j.salary,
    gender: ["Any", "Male", "Female"].includes(j.gender) ? j.gender : "Any",
    employmentType: j.employmentType,
    experience: j.experience,
    otherInfo: j.otherInfo,
  };
}
