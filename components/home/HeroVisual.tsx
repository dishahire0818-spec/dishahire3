import { BadgeCheck, Briefcase, CalendarCheck2, MapPin, Sparkles } from "lucide-react";

// Illustrative product-style cards (sample data) that show how working with DishaHire feels.
const SHORTLIST = [
  { initials: "RP", name: "Riya P.", role: "Sales Manager · 6 yrs", fit: 94 },
  { initials: "AK", name: "Arjun K.", role: "Sales Manager · 5 yrs", fit: 88 },
  { initials: "NS", name: "Neha S.", role: "Area Sales Lead · 4 yrs", fit: 81 },
];

const card = "rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)] backdrop-blur-xl";

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden>
      {/* glow behind the stack */}
      <div className="absolute inset-0 -z-10 rounded-full bg-gold-500/20 blur-3xl" />

      {/* new role */}
      <div className={`enter ${card} animate-float ml-auto w-[88%]`} style={{ animationDelay: "250ms" }}>
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 font-semibold text-gold-300"><Sparkles size={13} /> New role posted</span>
          <span className="text-white/45">just now</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400 text-brand-950"><Briefcase size={18} /></span>
          <div>
            <p className="font-display text-lg text-white">Sales Executive</p>
            <p className="flex items-center gap-1.5 text-xs text-white/60"><MapPin size={12} /> Rajkot · Full-time · 3–4 LPA</p>
          </div>
        </div>
      </div>

      {/* shortlist */}
      <div className="enter relative z-10 -mt-3 w-[92%] rounded-2xl bg-white p-4 text-brand-950 shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] sm:w-[86%]" style={{ animationDelay: "400ms" }}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-brand-800">Your shortlist</p>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-800">3 of 48 screened</span>
        </div>
        <ul className="mt-3 space-y-3">
          {SHORTLIST.map((c) => (
            <li key={c.name} className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-900 text-[11px] font-semibold text-gold-300">{c.initials}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="text-xs font-semibold text-brand-700 tabular-nums">{c.fit}% fit</p>
                </div>
                <p className="truncate text-xs text-muted">{c.role}</p>
                <div className="mt-1.5 h-1 rounded-full bg-brand-50">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-700 to-gold-500" style={{ width: `${c.fit}%` }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* interview */}
      <div className={`enter ${card} animate-float -mt-3 ml-auto flex w-[78%] items-center gap-3`} style={{ animationDelay: "550ms", animationDuration: "7s" }}>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300"><CalendarCheck2 size={18} /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">Interview scheduled</p>
          <p className="text-xs text-white/60">Tue, 11:00 AM · with hiring manager</p>
        </div>
        <BadgeCheck size={18} className="text-gold-300" />
      </div>
    </div>
  );
}
