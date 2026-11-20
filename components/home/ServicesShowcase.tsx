"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { SERVICES } from "@/lib/site";
import { cn } from "../ui";

// Illustrative progress bars for the decorative card (not statistics).
const MOCK = {
  recruitment: { label: "Hiring plan", rows: [["Permanent roles", 82], ["Contract staff", 64], ["Bulk drive", 48]] },
  sourcing: { label: "Candidate shortlist", rows: [["Skills match", 90], ["Experience fit", 76], ["Culture fit", 68]] },
  hr: { label: "HR roadmap", rows: [["Policy review", 70], ["Manpower plan", 85], ["Onboarding kit", 60]] },
} as const;

export function ServicesShowcase() {
  const [active, setActive] = useState(0);
  const svc = SERVICES[active];
  const mock = MOCK[svc.slug as keyof typeof MOCK];

  return (
    <div className="grid overflow-hidden rounded-[1.75rem] border border-line lg:grid-cols-[1fr_1.1fr]">
      <ul className="divide-y divide-line bg-white">
        {SERVICES.map((s, i) => (
          <li key={s.slug}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={cn(
                "w-full px-6 py-5 text-left transition-colors sm:px-8",
                i === active ? "bg-brand-900 text-white" : "text-brand-900 hover:bg-cream",
              )}
            >
              <span className="block font-display text-2xl">{s.title}</span>
              <span className={cn("mt-1 block text-sm", i === active ? "text-white/70" : "text-muted")}>{s.summary}</span>
            </button>
          </li>
        ))}
        <li className="px-6 py-5 sm:px-8">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm font-medium text-gold-700 hover:text-brand-900">
            Explore all services <ArrowRight size={16} />
          </Link>
        </li>
      </ul>

      <div className="grid-paper relative flex items-center justify-center bg-cream p-6 sm:p-10">
        <div className="w-full max-w-sm space-y-4">
          <div className="rounded-2xl bg-gold-100 p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold-700">{mock.label}</p>
            <div className="mt-4 space-y-3" aria-hidden>
              {mock.rows.map(([name, pct]) => (
                <div key={name}>
                  <div className="flex justify-between text-sm text-brand-900">
                    <span>{name}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white">
                    <div className="h-full rounded-full bg-brand-900 transition-[width] duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <p className="font-display text-xl text-brand-900">What&apos;s included</p>
            <ul className="mt-3 space-y-2">
              {svc.items.map((it) => (
                <li key={it} className="flex items-center gap-2.5 text-sm text-brand-900">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-900 text-white">
                    <Check size={12} />
                  </span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
