import Image from "next/image";
import { Check } from "lucide-react";
import { PHOTOS } from "@/lib/site";
import { Compass } from "../ui";

// Illustrative UI (sample names) that shows how a shortlist feels. Not real candidates.
const SHORTLIST = [
  { initials: "RP", name: "Riya P.", role: "Sales Manager · 6 yrs", fit: 92, tone: "bg-gold-200 text-brand-900" },
  { initials: "AK", name: "Arjun K.", role: "Sales Manager · 5 yrs", fit: 86, tone: "bg-brand-100 text-brand-900" },
  { initials: "NS", name: "Neha S.", role: "Area Sales Lead · 4 yrs", fit: 81, tone: "bg-gold-100 text-brand-900" },
];

export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[30rem] lg:max-w-none">
      <div className="enter absolute top-2 right-0 z-10 grid h-28 w-28 place-items-center rounded-full bg-white shadow-xl sm:-right-4 sm:h-32 sm:w-32" style={{ animationDelay: "450ms" }}>
        <Compass spin className="h-24 w-24 sm:h-28 sm:w-28" />
      </div>

      {/* photo */}
      <div className="absolute inset-x-0 top-10 bottom-0 overflow-hidden rounded-[2rem] bg-brand-800 shadow-[0_40px_80px_-40px_rgba(11,40,40,.6)] sm:left-16">
        <Image src={PHOTOS.consultant} alt="A DishaHire recruitment consultant" fill priority sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent" />
        <p className="absolute right-6 bottom-6 left-6 font-display text-2xl leading-tight text-white sm:text-3xl">
          “Every hire should move people <span className="italic text-gold-300">forward.</span>”
        </p>
      </div>

      {/* floating shortlist card */}
      <div className="enter absolute top-24 -left-2 w-[17rem] rounded-2xl border border-line bg-white/95 p-4 shadow-xl backdrop-blur sm:-left-6" style={{ animationDelay: "350ms" }}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold-700">Your shortlist</p>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] text-brand-800">3 of 48 screened</span>
        </div>
        <ul className="mt-3 space-y-2.5">
          {SHORTLIST.map((c) => (
            <li key={c.name} className="flex items-center gap-3">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-medium ${c.tone}`}>{c.initials}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-brand-900">{c.name}</p>
                <div className="mt-1 h-1 rounded-full bg-cream">
                  <div className="h-full rounded-full bg-brand-900" style={{ width: `${c.fit}%` }} />
                </div>
              </div>
              <span className="grid h-5 w-5 place-items-center rounded-full bg-gold-500 text-brand-950">
                <Check size={11} strokeWidth={3} />
              </span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
