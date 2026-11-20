"use client";

import Image from "next/image";
import { useState } from "react";
import { PHOTOS } from "@/lib/site";
import { cn } from "../ui";

const FLOWS = {
  employers: {
    label: "For employers",
    steps: [
      { title: "Share your requirement", body: "Tell us the role, skills, experience, budget and location in one short form or a quick call." },
      { title: "We source & screen", body: "We search our network, screen resumes and assess candidates so only relevant profiles reach you." },
      { title: "Review & interview", body: "Get a shortlist in 3–5 business days. We coordinate interview slots and feedback for you." },
      { title: "Hire with confidence", body: "We support offer discussions, background checks and onboarding so your new hire starts well." },
    ],
  },
  candidates: {
    label: "For job seekers",
    steps: [
      { title: "Share your profile", body: "Submit your details and resume in two minutes, or apply directly to an open job." },
      { title: "We match you to roles", body: "Our consultants match your skills and goals with openings across 15 industries." },
      { title: "Prepare & interview", body: "We brief you on the company and role, and schedule interviews that fit your time." },
      { title: "Get hired, free", body: "We never charge candidates. Ever. We stay in touch until you have joined." },
    ],
  },
} as const;

export function HowItWorks() {
  const [flow, setFlow] = useState<keyof typeof FLOWS>("employers");
  const [active, setActive] = useState(0);
  const steps = FLOWS[flow].steps;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="relative mx-auto w-full max-w-md lg:max-w-none">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-brand-800">
          <Image
            src={PHOTOS.consultant}
            alt="A DishaHire consultant ready to help"
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </div>
        <span className="absolute -top-4 right-6 grid h-20 w-20 rotate-12 place-items-center rounded-full bg-gold-500 text-center font-display text-lg leading-none text-brand-950 shadow-lg">
          Free for
          <br />
          seekers
        </span>
      </div>

      <div>
        <div role="tablist" aria-label="Who is this for" className="mb-6 inline-flex rounded-full bg-white/10 p-1">
          {(Object.keys(FLOWS) as (keyof typeof FLOWS)[]).map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={flow === k}
              onClick={() => {
                setFlow(k);
                setActive(0);
              }}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition-colors",
                flow === k ? "bg-gold-500 text-brand-950" : "text-white/80 hover:text-white",
              )}
            >
              {FLOWS[k].label}
            </button>
          ))}
        </div>

        <ol className="relative space-y-3 border-l border-dashed border-white/20 pl-6">
          {steps.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.title} className="relative">
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-6 -left-[1.95rem] h-3 w-3 rounded-full border-2",
                    on ? "border-gold-300 bg-gold-300" : "border-white/30 bg-brand-900",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-expanded={on}
                  className={cn(
                    "w-full rounded-2xl border p-5 text-left transition-colors",
                    on ? "border-brand-700 bg-brand-800" : "border-white/15 hover:border-white/35",
                  )}
                >
                  <span className="text-xs text-white/60">Step {String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-1 block font-display text-2xl text-white">{s.title}</span>
                  {on && <span className="mt-2 block text-sm leading-relaxed text-white/75">{s.body}</span>}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
