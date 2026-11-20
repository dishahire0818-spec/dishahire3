"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { FileText, Upload, X } from "lucide-react";
import { cn } from "../ui";

export const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-brand-900 outline-none transition-colors placeholder:text-muted/70 focus:border-brand-900 focus:ring-2 focus:ring-brand-900/10";

function Label({ id, label, required, hint }: { id: string; label: string; required?: boolean; hint?: string }) {
  return (
    <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-brand-900">
      <span>
        {label}
        {required ? <span className="text-gold-700"> *</span> : <span className="font-normal text-muted"> (optional)</span>}
      </span>
      {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

type Common = { label: string; hint?: string; className?: string };

export function Input({ label, hint, className, required, ...p }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={className}>
      <Label id={id} label={label} required={required} hint={hint} />
      <input id={id} required={required} className={inputCls} {...p} />
    </div>
  );
}

export function Select({ label, hint, className, required, options, placeholder, ...p }: Common & SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[]; placeholder?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <Label id={id} label={label} required={required} hint={hint} />
      <select id={id} required={required} defaultValue="" className={cn(inputCls, "appearance-none")} {...p}>
        <option value="" disabled={required}>
          {placeholder ?? "Select…"}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Textarea({ label, hint, className, required, ...p }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className={className}>
      <Label id={id} label={label} required={required} hint={hint} />
      <textarea id={id} required={required} rows={4} className={cn(inputCls, "resize-y")} {...p} />
    </div>
  );
}

export function ResumeInput({ required, className }: { required?: boolean; className?: string }) {
  const id = useId();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  return (
    <div className={className}>
      <Label id={id} label="Resume" required={required} hint="PDF or Word, up to 2 MB" />
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-4 text-sm transition-colors",
          file ? "border-brand-900 bg-brand-50" : "border-line hover:border-brand-900",
        )}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-900 text-white">
          {file ? <FileText size={18} /> : <Upload size={18} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-brand-900">{file ? file.name : "Upload your resume"}</span>
          <span className="block text-xs text-muted">{file ? `${(file.size / 1024).toFixed(0)} KB` : "Click to choose a file"}</span>
        </span>
        {file && (
          <button
            type="button"
            aria-label="Remove file"
            className="text-muted hover:text-brand-900"
            onClick={(e) => {
              e.preventDefault();
              const input = document.getElementById(id) as HTMLInputElement | null;
              if (input) input.value = "";
              setFile(null);
            }}
          >
            <X size={16} />
          </button>
        )}
      </label>
      <input
        id={id}
        name="resume"
        type="file"
        required={required}
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          if (f && f.size > 2 * 1024 * 1024) {
            setError("This file is larger than 2 MB. Please upload a smaller PDF.");
            e.target.value = "";
            setFile(null);
            return;
          }
          setError("");
          setFile(f);
        }}
      />
      {error && <p className="mt-1.5 text-xs text-red-700">{error}</p>}
    </div>
  );
}

/** Hidden field bots tend to fill in. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Leave this empty
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormError({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {children}
    </p>
  );
}

export async function submit(url: string, body: FormData, asJson = false) {
  const res = await fetch(url, {
    method: "POST",
    ...(asJson
      ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(body.entries())) }
      : { body }),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
}
