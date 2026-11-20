import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Factory,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Laptop,
  Megaphone,
  Plane,
  Radio,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
  Timer,
  TrendingUp,
  Truck,
  UserCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { JobCard, JobCardSkeleton } from "@/components/JobCard";
import { Arc, btn, cn, Eyebrow } from "@/components/ui";
import { getOpenJobs } from "@/lib/data";
import { INDUSTRIES, PHOTOS } from "@/lib/site";

const INDUSTRY_ICONS: LucideIcon[] = [
  Laptop, Stethoscope, Landmark, Factory, TrendingUp, UserCheck, ShoppingBag, Plane,
  GraduationCap, Building2, Radio, Megaphone, Truck, Zap, Rocket,
];

const POPULAR = ["Sales", "Accounts", "Engineer", "HR", "IT", "Marketing"];

const STATS = [
  { value: "15", label: "Industries served", body: "From IT and BFSI to manufacturing, logistics and startups.", tone: "bg-gold-200" },
  { value: "3–5 days", label: "To your first shortlist", body: "Screened, relevant profiles, not a pile of resumes.", tone: "bg-brand-100" },
  { value: "₹0", label: "Fees for job seekers", body: "We never charge candidates for placements or interviews.", tone: "bg-brand-100" },
  { value: "24 hrs", label: "Response to enquiries", body: "Every request gets a reply from a consultant within a day.", tone: "bg-gold-200" },
];

const WHY = [
  { icon: ShieldCheck, title: "Ethical & transparent", body: "Clear communication with clients and candidates at every step, with no hidden fees for job seekers." },
  { icon: BadgeCheck, title: "Screened shortlists", body: "Resume screening, assessment and interview coordination before a profile ever reaches you." },
  { icon: Timer, title: "Fast turnaround", body: "First shortlist in 3–5 business days, plus bulk-hiring capacity when you need to scale." },
  { icon: HeartHandshake, title: "Long-term fit", body: "We hire for alignment, not just to fill a seat, so people stay and grow with you." },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="container-page pt-14 pb-10 text-center sm:pt-20">
        <h1 className="mx-auto max-w-4xl text-5xl leading-[1.02] text-brand-900 sm:text-7xl lg:text-[5.5rem]">
          Right talent, <span className="italic text-gold-700">right direction.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          DishaHire connects ambitious professionals with forward-thinking employers across 15 industries, with
          ethical, transparent and fast hiring from Rajkot, Gujarat.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/contact?type=employer" className={cn(btn.gold, btn.lg, "w-full sm:w-auto")}>
            Hire talent <ArrowRight size={18} />
          </Link>
          <Link href="/jobs" className={cn(btn.outline, btn.lg, "w-full sm:w-auto")}>
            Browse open jobs
          </Link>
        </div>
      </section>

      {/* IMAGE STRIP + SEARCH */}
      <section aria-label="Find a job" className="relative">
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-4 px-4 sm:px-6 lg:grid-cols-[1fr_2.4fr_1fr]">
          <div className="relative hidden h-[28rem] overflow-hidden rounded-[1.75rem] bg-brand-100 lg:block">
            <Image src={PHOTOS.team} alt="" fill sizes="20vw" className="object-cover" />
            <div className="absolute right-4 bottom-6 left-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold-700">Shortlist ready</p>
              <p className="mt-1 font-display text-2xl text-brand-900">3–5 days</p>
              <p className="text-xs text-muted">from requirement to first profiles</p>
            </div>
          </div>

          <div className="relative h-[24rem] overflow-hidden rounded-[1.75rem] bg-brand-800 sm:h-[28rem]">
            <Image
              src={PHOTOS.meeting}
              alt="Recruiters and candidates in a meeting"
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 to-transparent" />
            <form
              action="/jobs"
              method="get"
              className="absolute top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-5 text-left shadow-2xl sm:p-7"
            >
              <label htmlFor="hero-q" className="font-display text-3xl text-brand-900">
                Find your next role
              </label>
              <div className="mt-4 flex items-center gap-2 rounded-full border border-line bg-cream py-1.5 pr-1.5 pl-4 focus-within:border-brand-900">
                <Search size={18} className="shrink-0 text-muted" aria-hidden />
                <input
                  id="hero-q"
                  name="q"
                  placeholder="Job title, skill or city"
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-brand-900 outline-none placeholder:text-muted"
                />
                <button type="submit" className={cn(btn.dark, "px-4")} aria-label="Search jobs">
                  <ArrowRight size={16} />
                </button>
              </div>
              <p className="mt-5 font-display text-xl text-brand-900">Popular searches</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {POPULAR.map((p) => (
                  <Link
                    key={p}
                    href={`/jobs?q=${encodeURIComponent(p)}`}
                    className="rounded-full border border-line px-3 py-1 text-xs text-brand-900 hover:border-brand-900"
                  >
                    {p}
                  </Link>
                ))}
              </div>
            </form>
          </div>

          <div className="relative hidden h-[28rem] overflow-hidden rounded-[1.75rem] bg-brand-100 lg:block">
            <Image src={PHOTOS.interview} alt="" fill sizes="20vw" className="object-cover" />
            <div className="absolute top-6 right-4 left-4 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold-700">Our process</p>
              <ul className="mt-2 space-y-1.5 text-sm text-brand-900">
                {["Screening", "Assessment", "Interviews", "Onboarding"].map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AT A GLANCE */}
      <section className="container-page py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div className="relative">
            <Arc className="absolute -top-10 -left-10 h-44 w-44 sm:-left-14" />
            <h2 className="relative pt-6 pl-8 text-4xl leading-tight text-brand-900 sm:text-5xl">
              DishaHire
              <br />
              at a glance
            </h2>
          </div>
          <div>
            <p className="max-w-xl text-muted">
              We are a professional recruitment consultancy committed to ethical, transparent and result-oriented
              hiring, focused on long-term alignment rather than short-term placements.
            </p>
            <dl className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {STATS.map((s) => (
                <div key={s.label} className="border-t border-line pt-5">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className={cn("highlight font-display text-4xl text-brand-900 sm:text-5xl", s.tone)}>{s.value}</span>
                    <p className="mt-4 font-medium text-brand-900">{s.label}</p>
                    <p className="mt-1 text-sm text-muted">{s.body}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-brand-900 py-20 text-white sm:py-28">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-4xl leading-tight sm:text-5xl">
              How hiring becomes <span className="italic text-gold-300">effortless</span>
            </h2>
            <p className="mt-4 text-white/70">
              From the first conversation to the first day at work, with a simple, guided process on both sides.
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-page py-20 sm:py-28">
        <div className="mb-10 grid gap-4 lg:grid-cols-2 lg:items-end">
          <h2 className="text-4xl leading-tight text-brand-900 sm:text-5xl">
            Everything you need
            <br />
            to hire smarter
          </h2>
          <p className="max-w-lg text-muted lg:justify-self-end">
            Recruitment, sourcing and HR consultancy under one roof, so you can scale your team without scaling your
            workload.
          </p>
        </div>
        <ServicesShowcase />
      </section>

      {/* INDUSTRIES */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="container-page">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>Our expertise</Eyebrow>
              <h2 className="mt-3 text-4xl text-brand-900 sm:text-5xl">Industries we serve</h2>
            </div>
            <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-gold-700 hover:text-brand-900">
              See open roles <ArrowRight size={16} />
            </Link>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((name, i) => {
              const Icon = INDUSTRY_ICONS[i] ?? Building2;
              return (
                <li key={name} className="flex items-center gap-4 rounded-2xl border border-line bg-white px-5 py-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-900 text-gold-300">
                    <Icon size={18} />
                  </span>
                  <span className="text-sm font-medium text-brand-900">{name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* LATEST JOBS */}
      <section className="container-page py-20 sm:py-28">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Eyebrow>Now hiring</Eyebrow>
            <h2 className="mt-3 text-4xl text-brand-900 sm:text-5xl">Latest openings</h2>
          </div>
          <Link href="/jobs" className={btn.outline}>
            View all jobs <ArrowRight size={16} />
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </div>
          }
        >
          <LatestJobs />
        </Suspense>
      </section>

      {/* WHY US */}
      <section className="bg-brand-900 py-20 text-white sm:py-28">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl leading-tight sm:text-5xl">
              Why companies
              <br />
              choose <span className="italic text-gold-300">DishaHire</span>
            </h2>
            <p className="mt-4 text-white/70">Smarter hiring, better fits, and a partner who picks up the phone.</p>
            <Link href="/contact?type=employer" className={cn(btn.gold, "mt-7")}>
              Start hiring today
            </Link>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-white/12 bg-white/[0.03] p-6 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold-500 text-brand-950">
                  <Icon size={20} />
                </span>
                <h3 className="mt-5 text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}

async function LatestJobs() {
  const jobs = (await getOpenJobs()).slice(0, 3);
  if (jobs.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-line p-10 text-center">
        <p className="font-display text-2xl text-brand-900">New openings are posted every week</p>
        <p className="mt-2 text-sm text-muted">Share your profile and we&apos;ll reach out when a matching role opens.</p>
        <Link href="/contact?type=candidate" className={cn(btn.dark, "mt-5")}>
          Submit your resume
        </Link>
      </div>
    );
  }
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((j) => (
        <JobCard key={j.id} job={j} showPosted={false} />
      ))}
    </div>
  );
}
