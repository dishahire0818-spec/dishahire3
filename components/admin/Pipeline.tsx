"use client";

import { useState } from "react";
import { Loader2, Send, X } from "lucide-react";
import { CANDIDATE_STAGES, LEAD_STATUSES } from "@/lib/pipeline";
import { cn } from "../ui";

export type Note = { _id: string; text: string; at: string; by?: string };
type Kind = "company" | "candidate" | "application";
type Patch = (body: Record<string, string>) => Promise<void>;

export const stagesFor = (kind: Kind) => (kind === "company" ? LEAD_STATUSES : CANDIDATE_STAGES);
export const stageField = (kind: Kind) => (kind === "company" ? "status" : "stage");

export function StagePicker({ kind, value, onChange }: { kind: Kind; value: string; onChange: Patch }) {
  const [busy, setBusy] = useState(false);
  const stages = stagesFor(kind);
  const current = stages.find((s) => s.id === value) ?? stages[0];
  return (
    <label className={cn("relative inline-flex items-center rounded-full border text-xs font-medium", current.tone)}>
      <span className="sr-only">Stage</span>
      {busy && <Loader2 size={12} className="absolute left-2 animate-spin" />}
      <select
        value={current.id}
        disabled={busy}
        onChange={async (e) => {
          setBusy(true);
          try {
            await onChange({ [stageField(kind)]: e.target.value });
          } finally {
            setBusy(false);
          }
        }}
        className={cn("cursor-pointer appearance-none bg-transparent py-1 pr-6 pl-3 outline-none", busy && "pl-6")}
      >
        {stages.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-2.5">▾</span>
    </label>
  );
}

export function Notes({ notes, onPatch }: { notes: Note[]; onPatch: Patch }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="mt-4 rounded-xl bg-[#f7f8f6] p-3">
      {notes.length > 0 && (
        <ul className="mb-3 space-y-2">
          {notes.map((n) => (
            <li key={n._id} className="group flex gap-3 rounded-lg bg-white px-3 py-2 text-sm">
              <div className="min-w-0 flex-1">
                <p className="whitespace-pre-line text-brand-900">{n.text}</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {new Date(n.at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  {n.by ? ` · ${n.by}` : ""}
                </p>
              </div>
              <button
                type="button"
                aria-label="Delete note"
                onClick={() => confirm("Delete this note?") && onPatch({ removeNoteId: n._id })}
                className="self-start rounded p-0.5 text-muted opacity-0 group-hover:opacity-100 hover:text-red-600 focus:opacity-100"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <form
        className="flex items-center gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!text.trim()) return;
          setBusy(true);
          try {
            await onPatch({ note: text.trim() });
            setText("");
          } finally {
            setBusy(false);
          }
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Add a private note"
          placeholder="Add a private note (call outcome, interview feedback…)"
          maxLength={2000}
          className="min-w-0 flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-900"
        />
        <button type="submit" disabled={busy || !text.trim()} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-900 text-white disabled:opacity-40" aria-label="Add note">
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        </button>
      </form>
    </div>
  );
}
