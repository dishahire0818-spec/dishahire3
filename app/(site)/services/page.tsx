import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ClipboardList, UserPlus, Briefcase } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { PageHero } from "@/components/PageHero";
import { btn, cn } from "@/components/ui";
import { CONTACT, PHOTOS, SERVICES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Recruitment & HR Services",
  description:
    "Permanent, contract and bulk staffing, resume screening, candidate assessment, background verification support, HR policy, manpower planning and onboarding: DishaHire services.",
  alternates: { canonical: "/services" },
};

const ICONS = [Briefcase, UserPlus, ClipboardList];
const IMAGES = [PHOTOS.building, PHOTOS.team, PHOTOS.interview];

const PROCESS = [
  { title: "Understand", body: "A short call to understand the role, team, budget and timelines." },
  { title: "Source", body: "We tap our candidate network, job portals and referrals." },
  { title: "Screen", body: "Resume screening, assessments and first-round interviews." },
  { title: "Deliver", body: "A shortlist in 3–5 business days, with interview coordination." },
  { title: "Onboard", body: "Offer support, background checks and joining follow-ups." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Hiring solutions that <span className="italic text-gold-700">fit your goals</span>
          </>
        }
        intro="Comprehensive recruitment and HR support, tailored to your business, your timelines and your budget."
      >
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/contact?type=employer" className={cn(btn.gold, btn.lg)}>
            Discuss your requirement <ArrowRight size={18} />
          </Link>
        </div>
      </PageHero>

      <section className="container-page space-y-20 py-20 sm:space-y-28 sm:py-28">
        {SERVICES.map((s, i) => {
          const Icon = ICONS[i];
          return (
            <article key={s.slug} id={s.slug} className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={cn(i % 2 === 1 && "lg:order-2")}>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-900 text-gold-300">
                  <Icon size={20} />
                </span>
                <h2 className="mt-5 text-4xl text-brand-900 sm:text-5xl">{s.title}</h2>
                <p className="mt-4 max-w-lg leading-relaxed text-muted">{s.summary}</p>
                <ul className="mt-6 grid gap-3">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3 text-brand-900">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-700">
                        <Check size={14} />
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem] bg-brand-100">
                <Image src={IMAGES[i]} alt={s.title} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
              </div>
            </article>
          );
        })}
      </section>

      <section className="bg-brand-900 py-20 text-white sm:py-28">
        <div className="container-page">
          <h2 className="max-w-xl text-4xl leading-tight sm:text-5xl">
            Our hiring <span className="italic text-gold-300">process</span>
          </h2>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((p, i) => (
              <li key={p.title} className="rounded-2xl border border-white/12 p-6">
                <span className="text-xs text-gold-300">Step {String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-2xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{p.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-sm text-white/70">
            Prefer to talk first?{" "}
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gold-300 underline underline-offset-4">
              Message a consultant on WhatsApp
            </a>
            .
          </p>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
