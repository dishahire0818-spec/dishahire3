"use client";

import { useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import { FormError, inputCls } from "../forms/fields";
import { btn, cn } from "../ui";

type Call = (url: string, method: string, body?: unknown) => Promise<Record<string, unknown>>;

function Card({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 sm:p-7">
      <h2 className="text-2xl text-brand-900">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({ label, className, ...p }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-medium text-brand-900">{label}</span>
      <input className={inputCls} {...p} />
    </label>
  );
}

/** Move/remove controls for list items. */
function ItemTools({ i, n, move, remove }: { i: number; n: number; move: (from: number, to: number) => void; remove: (i: number) => void }) {
  const b = "grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-brand-900 hover:text-brand-900 disabled:opacity-30";
  return (
    <div className="flex gap-1.5">
      <button type="button" className={b} disabled={i === 0} onClick={() => move(i, i - 1)} aria-label="Move up"><ArrowUp size={14} /></button>
      <button type="button" className={b} disabled={i === n - 1} onClick={() => move(i, i + 1)} aria-label="Move down"><ArrowDown size={14} /></button>
      <button type="button" className={cn(b, "hover:border-red-600 hover:text-red-600")} onClick={() => remove(i)} aria-label="Remove"><Trash2 size={14} /></button>
    </div>
  );
}

const moveItem = <T,>(arr: T[], from: number, to: number) => {
  const next = [...arr];
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
};

export function SettingsPanel({ initial, call, onSaved }: { initial: SiteSettings; call: Call; onSaved: (next: SiteSettings) => void }) {
  const [s, setS] = useState<SiteSettings>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const dirty = JSON.stringify(s) !== JSON.stringify(initial);

  const setContact = (k: keyof SiteSettings["contact"]) => (e: { target: { value: string } }) =>
    setS((v) => ({ ...v, contact: { ...v.contact, [k]: e.target.value } }));

  async function save() {
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const out = await call("/api/admin/settings", "PUT", s);
      const next = out.settings as SiteSettings;
      setS(next);
      setSaved(true);
      onSaved(next);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5 pb-24">
      <Card title="Contact details" hint="Shown in the footer, contact page, mobile menu and WhatsApp buttons across the site.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" type="email" value={s.contact.email} onChange={setContact("email")} />
          <Field label="Phone (as displayed)" value={s.contact.phone} onChange={setContact("phone")} placeholder="+91 84879 98492" />
          <Field label="WhatsApp number (with country code)" value={s.contact.whatsapp} onChange={setContact("whatsapp")} placeholder="918487998492" />
          <Field label="Office hours" value={s.contact.hours} onChange={setContact("hours")} />
          <Field label="Address" className="sm:col-span-2" value={s.contact.address} onChange={setContact("address")} />
          <Field label="LinkedIn page URL" value={s.contact.linkedin} onChange={setContact("linkedin")} placeholder="https://www.linkedin.com/company/…" />
          <Field label="Instagram URL" value={s.contact.instagram} onChange={setContact("instagram")} placeholder="https://www.instagram.com/…" />
        </div>
      </Card>

      <Card title="Home page numbers" hint="The four figures on the home page (the first three also appear in the hero). Only use numbers you can stand behind.">
        <div className="grid gap-3">
          {s.stats.map((st, i) => (
            <div key={i} className="grid grid-cols-[5rem_5rem_1fr] gap-3">
              <Field label={i === 0 ? "Number" : ""} aria-label="Number" value={st.value} maxLength={12} onChange={(e) => setS((v) => ({ ...v, stats: v.stats.map((x, k) => (k === i ? { ...x, value: e.target.value } : x)) }))} />
              <Field label={i === 0 ? "Unit" : ""} aria-label="Unit" value={st.unit} maxLength={12} placeholder="days" onChange={(e) => setS((v) => ({ ...v, stats: v.stats.map((x, k) => (k === i ? { ...x, unit: e.target.value } : x)) }))} />
              <Field label={i === 0 ? "Label" : ""} aria-label="Label" value={st.label} maxLength={60} onChange={(e) => setS((v) => ({ ...v, stats: v.stats.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)) }))} />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Announcement bar" hint="Optional strip at the very top of every page, e.g. a walk-in drive or holiday notice. Leave empty to hide it.">
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <Field label="Text" value={s.announcement.text} maxLength={160} placeholder="Walk-in hiring drive this Saturday, 10 AM to 2 PM" onChange={(e) => setS((v) => ({ ...v, announcement: { ...v.announcement, text: e.target.value } }))} />
          <Field label="Link (optional)" value={s.announcement.href} placeholder="/jobs" onChange={(e) => setS((v) => ({ ...v, announcement: { ...v.announcement, href: e.target.value } }))} />
        </div>
      </Card>

      <Card title="Testimonials" hint="Shown on the home page once you add at least one. Please only add real quotes, with the client's permission.">
        <div className="space-y-4">
          {s.testimonials.map((t, i) => (
            <div key={i} className="rounded-xl border border-line p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Testimonial {i + 1}</span>
                <ItemTools i={i} n={s.testimonials.length} move={(a, b) => setS((v) => ({ ...v, testimonials: moveItem(v.testimonials, a, b) }))} remove={(k) => setS((v) => ({ ...v, testimonials: v.testimonials.filter((_, x) => x !== k) }))} />
              </div>
              <textarea aria-label="Quote" className={cn(inputCls, "resize-y")} rows={3} maxLength={600} value={t.quote} placeholder="What the client said…" onChange={(e) => setS((v) => ({ ...v, testimonials: v.testimonials.map((x, k) => (k === i ? { ...x, quote: e.target.value } : x)) }))} />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input aria-label="Name" className={inputCls} value={t.name} maxLength={80} placeholder="Name" onChange={(e) => setS((v) => ({ ...v, testimonials: v.testimonials.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)) }))} />
                <input aria-label="Role and company" className={inputCls} value={t.role} maxLength={120} placeholder="Role, Company" onChange={(e) => setS((v) => ({ ...v, testimonials: v.testimonials.map((x, k) => (k === i ? { ...x, role: e.target.value } : x)) }))} />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setS((v) => ({ ...v, testimonials: [...v.testimonials, { quote: "", name: "", role: "" }] }))} className={btn.outline}>
            <Plus size={16} /> Add testimonial
          </button>
        </div>
      </Card>

      <Card title="FAQ" hint="Questions and answers on the contact page (also shown in Google results).">
        <div className="space-y-4">
          {s.faq.map((f, i) => (
            <div key={i} className="rounded-xl border border-line p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Question {i + 1}</span>
                <ItemTools i={i} n={s.faq.length} move={(a, b) => setS((v) => ({ ...v, faq: moveItem(v.faq, a, b) }))} remove={(k) => setS((v) => ({ ...v, faq: v.faq.filter((_, x) => x !== k) }))} />
              </div>
              <input aria-label="Question" className={inputCls} value={f.q} maxLength={200} placeholder="Question" onChange={(e) => setS((v) => ({ ...v, faq: v.faq.map((x, k) => (k === i ? { ...x, q: e.target.value } : x)) }))} />
              <textarea aria-label="Answer" className={cn(inputCls, "mt-3 resize-y")} rows={3} maxLength={1500} value={f.a} placeholder="Answer" onChange={(e) => setS((v) => ({ ...v, faq: v.faq.map((x, k) => (k === i ? { ...x, a: e.target.value } : x)) }))} />
            </div>
          ))}
          <button type="button" onClick={() => setS((v) => ({ ...v, faq: [...v.faq, { q: "", a: "" }] }))} className={btn.outline}>
            <Plus size={16} /> Add question
          </button>
        </div>
      </Card>

      {/* Sticky save bar */}
      <div className="fixed right-0 bottom-0 left-0 z-30 border-t border-line bg-white/95 backdrop-blur lg:left-64">
        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-8">
          <div className="flex-1 text-sm">
            {error ? (
              <FormError>{error}</FormError>
            ) : saved && !dirty ? (
              <span className="inline-flex items-center gap-2 text-emerald-700"><CheckCircle2 size={16} /> Saved. The website updates within a few seconds.</span>
            ) : (
              <span className="text-muted">{dirty ? "You have unsaved changes." : "All changes saved."}</span>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" disabled={!dirty || busy} onClick={() => { setS(initial); setError(""); }} className={btn.outline}>Discard</button>
            <button type="button" disabled={!dirty || busy} onClick={save} className={btn.dark}>
              {busy && <Loader2 size={16} className="animate-spin" />} Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
