import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ArrowUpRight, Check, ClipboardList, Search, UserPlus, Users } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { HeroVisual } from "@/components/home/HeroVisual";
import { Process } from "@/components/home/Process";
import { JobRow, JobRowSkeleton } from "@/components/JobRow";
import { IndustryMarquee } from "@/components/Marquee";
import { btn, cn, SectionHeading } from "@/components/ui";
import { getOpenJobs } from "@/lib/data";
import { PHOTOS, SERVICES } from "@/lib/site";

const STATS = [
  { value: "15", label: "industries served" },
  { value: "3–5", unit: "days", label: "to your first shortlist" },
  { value: "₹0", label: "fees for job seekers" },
  { value: "24", unit: "hrs", label: "reply to every enquiry" },
];

const WHY = [
  { title: "Ethical & transparent", body: "Clear communication at every step, and no fees for candidates. Ever." },
  { title: "Screened, not forwarded", body: "Every profile is screened and assessed before it reaches your inbox." },
  { title: "Fast, local, responsive", body: "First shortlist in 3–5 business days, from a team that picks up the phone." },
  { title: "Built for long-term fit", body: "We hire for alignment, not just to fill a seat, so people stay and grow." },
];

export default function HomePage() {
  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden">
        <div className="container-page relative grid items-center gap-14 pt-12 pb-16 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:pt-20 lg:pb-24">
          <div>
            <Link
              href="/jobs"
              className="enter inline-flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pr-4 pl-2 text-sm text-brand-900 shadow-sm hover:border-brand-900"
            >
              <span className="h-2 w-2 rounded-full bg-gold-500 animate-pulse-dot" />
              Now hiring across Gujarat
              <ArrowRight size={14} className="text-muted" />
            </Link>
            <h1 className="enter mt-7 text-[3.4rem] leading-[0.95] tracking-tight text-brand-900 sm:text-7xl lg:text-[6.2rem]" style={{ animationDelay: "80ms" }}>
              Right talent,
              <br />
              <span className="italic text-gold-700">right direction.</span>
            </h1>
            <p className="enter mt-7 max-w-lg text-lg leading-relaxed text-muted" style={{ animationDelay: "160ms" }}>
              DishaHire is a Rajkot-based recruitment consultancy that finds the people your business needs, and helps job
              seekers find work worth staying for.
            </p>
            <div className="enter mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
              <Link href="/contact?type=employer" className={cn(btn.dark, btn.lg)}>
                Hire talent <ArrowRight size={18} />
              </Link>
              <Link href="/jobs" className={cn(btn.outline, btn.lg)}>
                <Search size={17} /> Find a job
              </Link>
            </div>
            <dl className="enter mt-12 grid max-w-lg grid-cols-3 divide-x divide-line border-t border-line pt-6" style={{ animationDelay: "320ms" }}>
              {[
                ["15", "industries"],
                ["3–5 days", "to shortlist"],
                ["₹0", "for candidates"],
              ].map(([v, l]) => (
                <div key={l} className="px-4 first:pl-0">
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <span className="block font-display text-3xl text-brand-900">{v}</span>
                    <span className="text-sm text-muted">{l}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <HeroVisual />
        </div>
        <IndustryMarquee />
      </section>

      {/* ───────── TWO PATHS ───────── */}
      <section className="container-page py-20 sm:py-28">
        <SectionHeading index="01" eyebrow="Two ways we help" title={<>One consultancy, <span className="italic">both sides</span> of the table</>} />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <article className="reveal relative flex flex-col overflow-hidden rounded-[2rem] bg-brand-900 p-8 text-white sm:p-12">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-300">For employers</p>
            <h3 className="mt-4 text-4xl leading-tight sm:text-5xl">Build your team without the hiring headache</h3>
            <ul className="mt-8 space-y-3 text-white/85">
              {["Screened shortlist in 3–5 business days", "Permanent, contract and bulk hiring", "Interview coordination and offer support", "HR policy and onboarding guidance"].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-500 text-brand-950"><Check size={12} strokeWidth={3} /></span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap items-center gap-5 pt-10">
              <Link href="/contact?type=employer" className={cn(btn.gold, btn.lg)}>Share a requirement</Link>
              <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white">Our services <ArrowUpRight size={15} /></Link>
            </div>
          </article>
          <article className="reveal relative flex flex-col overflow-hidden rounded-[2rem] bg-gold-100 p-8 sm:p-12">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-700">For job seekers</p>
            <h3 className="mt-4 text-4xl leading-tight text-brand-900 sm:text-5xl">Get matched with roles that fit your goals</h3>
            <ul className="mt-8 space-y-3 text-brand-900">
              {["100% free, we never charge candidates", "Openings across 15 industries", "Interview preparation and scheduling", "Apply online in two minutes"].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-900 text-white"><Check size={12} strokeWidth={3} /></span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap items-center gap-5 pt-10">
              <Link href="/jobs" className={cn(btn.dark, btn.lg)}>Browse open jobs</Link>
              <Link href="/contact?type=candidate" className="inline-flex items-center gap-1.5 text-sm text-brand-900 hover:text-gold-700">Submit your resume <ArrowUpRight size={15} /></Link>
            </div>
          </article>
        </div>
      </section>

      {/* ───────── STATS BAND ───────── */}
      <section className="border-y border-line bg-cream">
        <dl className="container-page grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className={cn("reveal px-2 py-10 sm:px-8 sm:py-14", i % 2 === 1 && "border-l border-line", i >= 2 && "border-t border-line lg:border-t-0", i === 2 && "lg:border-l")}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="font-display text-6xl leading-none text-brand-900 sm:text-7xl">{s.value}</span>
                {s.unit && <span className="ml-1.5 font-display text-2xl text-gold-700 italic">{s.unit}</span>}
                <span className="mt-3 block text-sm text-muted">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ───────── PROCESS ───────── */}
      <section className="container-page py-20 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading index="02" eyebrow="How it works" title={<>A clear path from <span className="italic">hello</span> to hired</>} />
        </div>
        <div className="mt-10">
          <Process />
        </div>
      </section>

      {/* ───────── SERVICES BENTO ───────── */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading index="03" eyebrow="Services" title={<>Everything you need<br />to hire <span className="italic">smarter</span></>} />
            <Link href="/services" className={cn(btn.outline, "reveal self-start bg-white lg:self-auto")}>All services <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-6 lg:grid-rows-[auto_auto]">
            {/* Recruitment: large dark tile */}
            <Link href="/services#recruitment" className="reveal group relative overflow-hidden rounded-[2rem] bg-brand-900 p-8 text-white lg:col-span-4 lg:row-span-1 sm:p-10">
              <div className="flex items-start justify-between gap-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-500 text-brand-950"><Users size={20} /></span>
                <ArrowUpRight className="text-white/50 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-gold-300" />
              </div>
              <h3 className="mt-8 text-4xl">{SERVICES[0].title}</h3>
              <p className="mt-3 max-w-md text-white/70">{SERVICES[0].summary}</p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {SERVICES[0].items.map((i) => (
                  <li key={i.name} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/85">{i.name}</li>
                ))}
              </ul>
            </Link>
            {/* Photo tile */}
            <div className="reveal relative min-h-64 overflow-hidden rounded-[2rem] bg-brand-800 lg:col-span-2">
              <Image src={PHOTOS.interview} alt="Candidate interview in progress" fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent" />
              <p className="absolute right-6 bottom-6 left-6 font-display text-2xl leading-tight text-white">Bulk hiring, organised end to end</p>
            </div>
            {/* Sourcing */}
            <Link href="/services#sourcing" className="reveal group relative overflow-hidden rounded-[2rem] border border-line bg-white p-8 lg:col-span-3 sm:p-10">
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-900 text-gold-300"><UserPlus size={20} /></span>
                <ArrowUpRight className="text-muted transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-brand-900" />
              </div>
              <h3 className="mt-8 text-3xl text-brand-900 sm:text-4xl">{SERVICES[1].title}</h3>
              <p className="mt-3 text-muted">{SERVICES[1].summary}</p>
              <ul className="mt-6 space-y-2">
                {SERVICES[1].items.map((i) => (
                  <li key={i.name} className="flex items-center gap-2.5 text-sm text-brand-900"><Check size={15} className="text-gold-700" />{i.name}</li>
                ))}
              </ul>
            </Link>
            {/* HR */}
            <Link href="/services#hr" className="reveal group relative overflow-hidden rounded-[2rem] bg-gold-100 p-8 lg:col-span-3 sm:p-10">
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-900 text-gold-300"><ClipboardList size={20} /></span>
                <ArrowUpRight className="text-muted transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-brand-900" />
              </div>
              <h3 className="mt-8 text-3xl text-brand-900 sm:text-4xl">{SERVICES[2].title}</h3>
              <p className="mt-3 text-brand-900/70">{SERVICES[2].summary}</p>
              <ul className="mt-6 space-y-2">
                {SERVICES[2].items.map((i) => (
                  <li key={i.name} className="flex items-center gap-2.5 text-sm text-brand-900"><Check size={15} className="text-gold-700" />{i.name}</li>
                ))}
              </ul>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── LATEST JOBS ───────── */}
      <section className="container-page py-20 sm:py-28">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading index="04" eyebrow="Now hiring" title={<>Latest <span className="italic">openings</span></>} />
          <Link href="/jobs" className={cn(btn.outline, "reveal self-start sm:self-auto")}>View all jobs <ArrowRight size={16} /></Link>
        </div>
        <div className="mt-10">
          <Suspense fallback={<div className="grid gap-3"><JobRowSkeleton /><JobRowSkeleton /><JobRowSkeleton /></div>}>
            <LatestJobs />
          </Suspense>
        </div>
      </section>

      {/* ───────── WHY US ───────── */}
      <section className="border-t border-line py-20 sm:py-28">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <div className="reveal relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-800 lg:aspect-auto lg:h-full lg:min-h-[34rem]">
            <Image src={PHOTOS.office} alt="The DishaHire team at work" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/10 to-transparent" />
            <div className="absolute right-6 bottom-6 left-6 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
              <p className="font-display text-3xl">દિશા <span className="text-white/50">·</span> <span className="italic text-gold-300">Disha</span></p>
              <p className="mt-1 text-sm text-white/75">means &ldquo;direction&rdquo;. It&apos;s what we try to give every client and every candidate.</p>
            </div>
          </div>
          <div>
            <SectionHeading index="05" eyebrow="Why DishaHire" title={<>Why companies <span className="italic">choose us</span></>} intro="Smarter hiring, better fits, and a partner who actually picks up the phone." />
            <ol className="mt-10 divide-y divide-line border-y border-line">
              {WHY.map((w, i) => (
                <li key={w.title} className="reveal grid grid-cols-[3rem_1fr] gap-4 py-6">
                  <span className="font-display text-2xl text-gold-700">0{i + 1}</span>
                  <div>
                    <h3 className="text-2xl text-brand-900">{w.title}</h3>
                    <p className="mt-1.5 text-muted">{w.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}

async function LatestJobs() {
  const jobs = (await getOpenJobs()).slice(0, 4);
  if (jobs.length === 0) {
    return (
      <div className="reveal grid gap-6 rounded-[2rem] border border-dashed border-brand-900/20 bg-cream p-8 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
        <div>
          <p className="font-display text-3xl text-brand-900">New roles are added every week</p>
          <p className="mt-2 text-muted">Share your profile once, and we&apos;ll reach out as soon as a matching role opens.</p>
        </div>
        <Link href="/contact?type=candidate" className={cn(btn.dark, btn.lg)}>Submit your resume</Link>
      </div>
    );
  }
  return (
    <div className="grid gap-3">
      {jobs.map((j) => (
        <JobRow key={j.id} job={j} />
      ))}
    </div>
  );
}
