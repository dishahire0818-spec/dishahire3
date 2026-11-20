import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, ClipboardList, UserPlus, Users } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { btn, cn, SectionHeading } from "@/components/ui";
import { FLOWS, PHOTOS, SERVICES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Recruitment & HR Services",
  description:
    "Permanent, contract and bulk staffing, resume screening, candidate assessment, background verification support, HR policy, manpower planning and onboarding: DishaHire services.",
  alternates: { canonical: "/services" },
};

const ICONS = [Users, UserPlus, ClipboardList];
const IMAGES = [PHOTOS.building, PHOTOS.team, PHOTOS.interview];

const MODELS = [
  { name: "Permanent hiring", for: "Long-term roles in your core team", how: "Screened shortlist in 3–5 business days, interview coordination, offer and joining support" },
  { name: "Contract & temporary", for: "Projects, seasonal peaks, short-notice cover", how: "Pre-vetted profiles for fixed durations, with quick replacements when needed" },
  { name: "Bulk hiring", for: "Sales, operations and production teams at scale", how: "Planned hiring drives: sourcing, screening and scheduling handled end to end" },
];

export default function ServicesPage() {
  return (
    <>
      {/* HERO: dark, with service index */}
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div className="container-page relative pt-16 pb-12 sm:pt-20">
          <nav aria-label="Breadcrumb" className="enter text-sm text-white/60">
            <Link href="/" className="hover:text-white">Home</Link> <span className="mx-1.5">/</span> <span className="text-white">Services</span>
          </nav>
          <h1 className="enter mt-5 max-w-4xl text-5xl leading-[1.02] sm:text-7xl" style={{ animationDelay: "80ms" }}>
            Hiring solutions that <span className="text-shine-light">fit your goals</span>
          </h1>
          <p className="enter mt-5 max-w-xl text-white/70 sm:text-lg" style={{ animationDelay: "160ms" }}>
            Recruitment, sourcing and HR consultancy, tailored to your business, your timelines and your budget.
          </p>
          <div className="mt-14 grid gap-3 md:grid-cols-3">
            {SERVICES.map((s, i) => {
              const Icon = ICONS[i];
              return (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  className="enter group flex items-center gap-4 rounded-2xl border border-white/12 bg-white/[0.04] p-5 backdrop-blur transition-colors hover:border-gold-300/60 hover:bg-white/[0.08]"
                  style={{ animationDelay: `${240 + i * 80}ms` }}
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-500 text-brand-950"><Icon size={19} /></span>
                  <span className="flex-1">
                    <span className="block text-xs text-white/50">0{i + 1}</span>
                    <span className="block font-display text-xl">{s.title}</span>
                  </span>
                  <ArrowDown size={16} className="text-white/40 transition-transform group-hover:translate-y-0.5 group-hover:text-gold-300" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES: sticky title + detail cards */}
      {SERVICES.map((s, i) => (
        <section key={s.slug} id={s.slug} className={cn("scroll-mt-20 py-20 sm:py-28", i % 2 === 1 && "bg-cream")}>
          <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading index={`0${i + 1}`} eyebrow="Service" title={s.title} intro={s.summary} />
              <p className="reveal mt-6 inline-flex items-center gap-2 rounded-full bg-gold-100 px-4 py-2 text-sm text-brand-900">
                <span className="font-medium">Best for:</span> {s.bestFor}
              </p>
              <div className="reveal relative mt-8 hidden aspect-[16/10] overflow-hidden rounded-[2rem] bg-brand-100 lg:block">
                <Image src={IMAGES[i]} alt="" fill sizes="40vw" className="object-cover" />
              </div>
            </div>
            <ol className="grid gap-4">
              {s.items.map((it, k) => (
                <li key={it.name} className="reveal rounded-[1.5rem] border border-line bg-white p-7 sm:p-8">
                  <div className="flex items-start gap-5">
                    <span className="font-display text-3xl text-gold-500">{String.fromCharCode(97 + k)}.</span>
                    <div>
                      <h3 className="text-3xl text-brand-900">{it.name}</h3>
                      <p className="mt-2 leading-relaxed text-muted">{it.desc}</p>
                    </div>
                  </div>
                </li>
              ))}
              <li className="reveal">
                <Link href="/contact?type=employer" className="group flex items-center justify-between rounded-[1.5rem] bg-brand-900 p-7 text-white sm:p-8">
                  <span className="font-display text-2xl">Discuss {s.title.toLowerCase()}</span>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-500 text-brand-950 transition-transform group-hover:translate-x-1"><ArrowRight size={18} /></span>
                </Link>
              </li>
            </ol>
          </div>
        </section>
      ))}

      {/* ENGAGEMENT MODELS */}
      <section className="border-y border-line py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading index="04" eyebrow="Engagement models" title={<>Pick the hiring model <span className="text-shine">that fits</span></>} />
          <div className="reveal mt-12 overflow-hidden rounded-[2rem] border border-line">
            <table className="w-full text-left">
              <thead className="hidden bg-cream text-xs uppercase tracking-[0.14em] text-muted md:table-header-group">
                <tr>
                  <th className="px-8 py-4 font-medium">Model</th>
                  <th className="px-8 py-4 font-medium">Best for</th>
                  <th className="px-8 py-4 font-medium">What we handle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {MODELS.map((m) => (
                  <tr key={m.name} className="grid gap-1 p-6 md:table-row md:p-0">
                    <th scope="row" className="font-display text-2xl font-normal text-brand-900 md:px-8 md:py-7">{m.name}</th>
                    <td className="text-brand-900 md:px-8 md:py-7">{m.for}</td>
                    <td className="text-muted md:px-8 md:py-7">
                      <span className="inline-flex gap-2"><Check size={16} className="mt-1 shrink-0 text-gold-700" />{m.how}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading index="05" eyebrow="Process" title={<>How an engagement <span className="text-shine">runs</span></>} />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FLOWS.employers.steps.map((s, i) => (
              <li key={s.title} className="reveal relative overflow-hidden rounded-[1.5rem] bg-cream p-7">
                <span className="absolute -top-4 -right-1 font-display text-[7rem] leading-none text-brand-900/[0.06]">{i + 1}</span>
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-gold-700">Step {i + 1}</span>
                <h3 className="mt-3 text-2xl text-brand-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="reveal mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link href="/contact?type=employer" className={cn(btn.dark, btn.lg)}>Share your requirement <ArrowRight size={18} /></Link>
            <span className="text-sm text-muted">A consultant will reply within 24 hours.</span>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
