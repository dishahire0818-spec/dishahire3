import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ArrowUpRight, Check, ClipboardList, MapPin, Quote, Search, UserPlus, Users } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { HeroVisual } from "@/components/home/HeroVisual";
import { Process } from "@/components/home/Process";
import { JobRow, JobRowSkeleton } from "@/components/JobRow";
import { IndustryMarquee } from "@/components/Marquee";
import { btn, cn, SectionHeading } from "@/components/ui";
import { getOpenJobs } from "@/lib/data";
import { getSettings } from "@/lib/settings";
import { SERVICES } from "@/lib/site";


const WHY = [
  { title: "Ethical & transparent", body: "Clear communication at every step, and no fees for candidates. Ever." },
  { title: "Screened, not forwarded", body: "Every profile is screened and assessed before it reaches your inbox." },
  { title: "Fast, local, responsive", body: "First shortlist in 3–5 business days, from a team that picks up the phone." },
  { title: "Built for long-term fit", body: "We hire for alignment, not just to fill a seat, so people stay and grow." },
];

export default async function HomePage() {
  const { stats, testimonials } = await getSettings();
  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div className="grid-lines absolute inset-0" aria-hidden />
        <div className="absolute -top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-gold-500/15 blur-[120px]" aria-hidden />
        <div className="absolute bottom-[-30%] left-[-10%] h-[30rem] w-[30rem] rounded-full bg-brand-700/40 blur-[120px]" aria-hidden />
        <div className="container-page relative grid items-center gap-14 pt-14 pb-16 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:pt-24 lg:pb-24">
          <div>
            <Link href="/jobs" className="enter inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 py-1.5 pr-3.5 pl-2 text-sm text-white/85 backdrop-blur hover:border-white/30">
              <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse-dot" />
              Now hiring across Gujarat
              <span className="text-white/40">·</span>
              <span className="font-semibold text-gold-300">View jobs</span>
              <ArrowRight size={14} className="text-gold-300" />
            </Link>
            <h1 className="enter mt-7 text-[2.9rem] leading-[1] sm:text-7xl lg:text-[5.4rem]" style={{ animationDelay: "80ms" }}>
              Right talent.
              <br />
              <span className="text-shine-light">Right direction.</span>
            </h1>
            <p className="enter mt-6 max-w-xl text-lg leading-relaxed text-white/70" style={{ animationDelay: "160ms" }}>
              DishaHire finds the people your business needs, and helps job seekers find work worth staying for. Screened
              shortlists in days, not weeks.
            </p>

            {/* search */}
            <form action="/jobs" method="get" className="enter mt-9 flex max-w-[36rem] flex-col gap-2 rounded-2xl bg-white p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,.7)] sm:flex-row sm:items-center sm:rounded-full" style={{ animationDelay: "240ms" }}>
              <label className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-1.5 sm:pl-4">
                <Search size={18} className="shrink-0 text-muted" aria-hidden />
                <span className="sr-only">Job title or skill</span>
                <input name="q" placeholder="Job title or skill" className="min-w-0 flex-1 bg-transparent py-2 text-[0.95rem] text-brand-950 outline-none placeholder:text-muted" />
              </label>
              <span className="hidden h-7 w-px bg-line sm:block" aria-hidden />
              <label className="flex min-w-0 items-center gap-2.5 px-3 py-1.5 sm:w-36 sm:flex-none">
                <MapPin size={17} className="shrink-0 text-muted" aria-hidden />
                <span className="sr-only">City</span>
                <input name="loc" placeholder="City" className="min-w-0 flex-1 bg-transparent py-2 text-[0.95rem] text-brand-950 outline-none placeholder:text-muted" />
              </label>
              <button type="submit" className={cn(btn.dark, "h-12 shrink-0 px-6 whitespace-nowrap")}>Search jobs</button>
            </form>
            <div className="enter mt-5 flex flex-wrap items-center gap-2 text-sm" style={{ animationDelay: "300ms" }}>
              <span className="text-white/50">Popular:</span>
              {["Sales", "Accounts", "Engineer", "HR", "IT"].map((p) => (
                <Link key={p} href={`/jobs?q=${encodeURIComponent(p)}`} className="rounded-full border border-white/12 px-3 py-1 text-white/75 transition-colors hover:border-gold-300/60 hover:text-white">
                  {p}
                </Link>
              ))}
              <span className="mx-1 text-white/25">|</span>
              <Link href="/contact?type=employer" className="inline-flex items-center gap-1 font-semibold text-gold-300 hover:text-gold-200">
                Hiring? Talk to us <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <HeroVisual />
        </div>

        {/* stats strip */}
        <div className="relative border-t border-white/10">
          <dl className="container-page grid grid-cols-2 lg:grid-cols-4">
            {stats.map((st, i) => (
              <div key={st.label + i} className={cn("px-1 py-7 sm:px-6", i > 0 && "lg:border-l lg:border-white/10", i % 2 === 1 && "border-l border-white/10", i >= 2 && "border-t border-white/10 lg:border-t-0")}>
                <dt className="sr-only">{st.label}</dt>
                <dd>
                  <span className="font-display text-4xl text-white sm:text-5xl">{st.value}</span>
                  {st.unit && <span className="ml-1.5 text-lg font-semibold text-gold-300">{st.unit}</span>}
                  <span className="mt-1 block text-sm text-white/55">{st.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <IndustryMarquee />

      {/* ───────── TWO PATHS ───────── */}
      <section className="container-page py-24 sm:py-32">
        <SectionHeading index="01" eyebrow="Two ways we help" title={<>One consultancy, <span className="text-shine">both sides</span> of the table.</>} />
        <div className="mt-14 grid border-y border-line md:grid-cols-2 md:divide-x md:divide-line">
          {[
            {
              who: "For employers",
              title: "Build your team without the hiring headache.",
              points: ["Screened shortlist in 3–5 business days", "Permanent, contract and bulk hiring", "Interview coordination and offer support", "HR policy and onboarding guidance"],
              cta: { label: "Share a requirement", href: "/contact?type=employer" },
              link: { label: "Our services", href: "/services" },
            },
            {
              who: "For job seekers",
              title: "Get matched with roles that fit your goals.",
              points: ["Always free, we never charge candidates", "Openings across 15 industries", "Interview preparation and scheduling", "Apply online in two minutes"],
              cta: { label: "Browse open jobs", href: "/jobs" },
              link: { label: "Submit your resume", href: "/contact?type=candidate" },
            },
          ].map((c, k) => (
            <article key={c.who} className={cn("reveal py-12", k === 0 ? "md:pr-14" : "border-t border-line md:border-t-0 md:pl-14")}>
              <p className="text-sm font-semibold text-gold-700">{c.who}</p>
              <h3 className="mt-3 text-3xl leading-tight text-brand-950 sm:text-[2.1rem]">{c.title}</h3>
              <ul className="mt-8 space-y-3.5">
                {c.points.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-brand-900/80">
                    <Check size={18} className="mt-0.5 shrink-0 text-brand-700" strokeWidth={2.5} />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link href={c.cta.href} className={k === 0 ? btn.dark : btn.outline}>{c.cta.label} <ArrowRight size={16} /></Link>
                <Link href={c.link.href} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-900">
                  {c.link.label} <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ───────── SERVICES ───────── */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading index="02" eyebrow="Services" title={<>Everything you need to <span className="text-shine">hire smarter.</span></>} />
            <Link href="/services" className={cn(btn.outline, "reveal self-start lg:self-auto")}>All services <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-3">
            {SERVICES.map((svc, k) => {
              const Icon = [Users, UserPlus, ClipboardList][k];
              return (
                <Link key={svc.slug} href={`/services#${svc.slug}`} className="reveal group flex flex-col bg-white p-8 transition-colors hover:bg-brand-950 sm:p-10">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-800 transition-colors group-hover:bg-white/10 group-hover:text-gold-300">
                      <Icon size={20} />
                    </span>
                    <span className="text-sm font-semibold text-brand-900/30 tabular-nums transition-colors group-hover:text-white/40">0{k + 1}</span>
                  </div>
                  <h3 className="mt-10 text-2xl text-brand-950 transition-colors group-hover:text-white">{svc.title}</h3>
                  <p className="mt-3 text-muted transition-colors group-hover:text-white/70">{svc.summary}</p>
                  <ul className="mt-8 space-y-2.5 border-t border-line pt-6 text-sm text-brand-900/80 transition-colors group-hover:border-white/10 group-hover:text-white/80">
                    {svc.items.map((it) => (
                      <li key={it.name} className="flex items-center gap-2.5">
                        <span className="h-1 w-1 rounded-full bg-gold-500" />
                        {it.name}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-10 text-sm font-semibold text-brand-900 transition-colors group-hover:text-gold-300">
                    Learn more <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── PROCESS ───────── */}
      <section className="container-page py-24 sm:py-32">
        <SectionHeading index="03" eyebrow="How it works" title={<>A clear path from <span className="text-shine">hello</span> to hired.</>} />
        <div className="mt-12">
          <Process />
        </div>
      </section>

      {/* ───────── LATEST JOBS ───────── */}
      <section className="border-t border-line">
        <div className="container-page py-24 sm:py-32">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading index="04" eyebrow="Now hiring" title={<>Latest <span className="text-shine">openings.</span></>} />
            <Link href="/jobs" className={cn(btn.outline, "reveal self-start sm:self-auto")}>View all jobs <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-12">
            <Suspense fallback={<div className="grid gap-3"><JobRowSkeleton /><JobRowSkeleton /><JobRowSkeleton /></div>}>
              <LatestJobs />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ───────── WHY US ───────── */}
      <section className="bg-cream py-24 sm:py-32">
        <div className="container-page">
          <SectionHeading align="center" index="05" eyebrow="Why DishaHire" title={<>Why companies <span className="text-shine">choose us.</span></>} intro="Smarter hiring, better fits, and a partner who actually picks up the phone." />
          <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {WHY.map((w, k) => (
              <li key={w.title} className="reveal border-t-2 border-brand-950 pt-6">
                <span className="text-sm font-semibold text-gold-700 tabular-nums">0{k + 1}</span>
                <h3 className="mt-3 text-xl text-brand-950">{w.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{w.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── TESTIMONIALS (only when added in admin) ───────── */}
      {testimonials.length > 0 && (
        <section className="bg-cream py-20 sm:py-28">
          <div className="container-page">
            <SectionHeading index="06" eyebrow="Testimonials" title={<>What our clients <span className="text-shine">say</span></>} />
            <ul className={cn("mt-12 grid gap-4", testimonials.length > 1 && "md:grid-cols-2", testimonials.length > 2 && "lg:grid-cols-3")}>
              {testimonials.map((t) => (
                <li key={t.name + t.quote.slice(0, 20)} className="reveal flex flex-col rounded-[2rem] bg-white p-8 sm:p-10">
                  <Quote size={28} className="text-gold-500" />
                  <blockquote className="mt-5 flex-1 font-display text-2xl leading-snug text-brand-900">“{t.quote}”</blockquote>
                  <div className="mt-8 flex items-center gap-3 border-t border-line pt-5">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-900 font-display text-lg text-gold-300">{t.name.charAt(0)}</span>
                    <span>
                      <span className="block font-medium text-brand-900">{t.name}</span>
                      {t.role && <span className="block text-sm text-muted">{t.role}</span>}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

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
