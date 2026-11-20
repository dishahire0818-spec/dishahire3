"use client";

import { useState } from "react";
import { FLOWS } from "@/lib/site";
import { cn } from "../ui";



export function Process() {
  const [flow, setFlow] = useState<keyof typeof FLOWS>("employers");
  const steps = FLOWS[flow].steps;
  return (
    <div>
      <div role="tablist" aria-label="Choose your path" className="inline-flex rounded-full border border-line bg-white p-1">
        {(Object.keys(FLOWS) as (keyof typeof FLOWS)[]).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={flow === k}
            onClick={() => setFlow(k)}
            className={cn("rounded-full px-5 py-2.5 text-sm transition-colors", flow === k ? "bg-brand-900 text-white" : "text-brand-900 hover:bg-cream")}
          >
            {FLOWS[k].label}
          </button>
        ))}
      </div>

      <ol key={flow} className="relative mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
        {/* the route line */}
        <svg aria-hidden className="absolute top-6 left-6 hidden h-2 w-[calc(100%-3rem)] md:block" preserveAspectRatio="none" viewBox="0 0 100 2">
          <line x1="0" y1="1" x2="100" y2="1" stroke="#b08d3e" strokeWidth="0.6" strokeDasharray="1.2 1.6" vectorEffect="non-scaling-stroke" />
        </svg>
        <span aria-hidden className="absolute top-0 bottom-0 left-6 w-px border-l border-dashed border-gold-500 md:hidden" />
        {steps.map((s, i) => (
          <li key={s.title} className="enter relative pl-16 md:pl-0" style={{ animationDelay: `${i * 90}ms` }}>
            <span
              className={cn(
                "absolute top-0 left-0 grid h-12 w-12 place-items-center rounded-full border font-display text-xl md:relative",
                i === steps.length - 1 ? "border-gold-500 bg-gold-500 text-brand-950" : "border-brand-900/15 bg-white text-brand-900",
              )}
            >
              {i + 1}
            </span>
            <h3 className="text-2xl text-brand-900 md:mt-6">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
