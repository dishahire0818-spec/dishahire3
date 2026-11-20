import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, ChevronDown, Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactTabs } from "@/components/ContactTabs";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeading, WhatsAppIcon } from "@/components/ui";
import { CONTACT, FAQ } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Hiring or looking for a job? Contact DishaHire in Rajkot, Gujarat. Share your requirement or submit your resume, and a consultant will reply within 24 hours.",
  alternates: { canonical: "/contact" },
};

const QUICK = [
  { icon: WhatsAppIcon, label: "WhatsApp", value: "Chat with a consultant", href: CONTACT.whatsapp, external: true, tone: "bg-brand-900 text-white", iconTone: "bg-gold-500 text-brand-950" },
  { icon: Phone, label: "Call us", value: CONTACT.phone, href: CONTACT.phoneHref, tone: "bg-white border border-line text-brand-900", iconTone: "bg-brand-900 text-gold-300" },
  { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, tone: "bg-white border border-line text-brand-900", iconTone: "bg-brand-900 text-gold-300" },
];

export default function ContactPage() {
  return (
    <>
      {/* HERO: headline + quick contact actions */}
      <section className="relative overflow-hidden border-b border-line bg-cream">
        <div className="container-page relative grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <nav aria-label="Breadcrumb" className="enter text-sm text-muted">
              <Link href="/" className="hover:text-brand-900">Home</Link> <span className="mx-1.5">/</span> <span className="text-brand-900">Contact</span>
            </nav>
            <h1 className="enter mt-6 text-5xl leading-[0.98] text-brand-900 sm:text-7xl" style={{ animationDelay: "80ms" }}>
              Let&apos;s start a <span className="italic text-gold-700">conversation.</span>
            </h1>
            <p className="enter mt-6 max-w-md text-lg text-muted" style={{ animationDelay: "160ms" }}>
              Hiring, or looking for your next role? Tell us below. A consultant replies within 24 hours.
            </p>
          </div>
          <ul className="grid gap-3">
            {QUICK.map(({ icon: Icon, label, value, href, external, tone, iconTone }, i) => (
              <li key={label} className="enter" style={{ animationDelay: `${200 + i * 80}ms` }}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`group flex items-center gap-4 rounded-2xl p-4 pr-5 transition-transform hover:-translate-y-0.5 ${tone}`}
                >
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${iconTone}`}>
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs uppercase tracking-[0.14em] opacity-60">{label}</span>
                    <span className="block truncate font-medium">{value}</span>
                  </span>
                  <ArrowUpRight size={18} className="shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FORM */}
      <section className="container-page grid gap-8 py-16 sm:py-20 lg:grid-cols-[1fr_20rem] lg:gap-12">
        <div className="rounded-[2rem] border border-line bg-white p-4 shadow-[0_30px_60px_-45px_rgba(16,56,56,.45)] sm:p-10">
          <Suspense fallback={<div className="h-[40rem] animate-pulse rounded-2xl bg-cream" />}>
            <ContactTabs />
          </Suspense>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-900 p-7 text-white">
            <h2 className="text-3xl">Visit or call</h2>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex gap-3"><MapPin size={18} className="shrink-0 text-gold-300" /><span><span className="block text-white/55">Office</span>{CONTACT.address}</span></li>
              <li className="flex gap-3"><Clock size={18} className="shrink-0 text-gold-300" /><span><span className="block text-white/55">Hours</span>{CONTACT.hours}</span></li>
              <li className="flex gap-3"><Phone size={18} className="shrink-0 text-gold-300" /><span><span className="block text-white/55">Phone</span><a href={CONTACT.phoneHref} className="hover:text-gold-300">{CONTACT.phone}</a></span></li>
            </ul>
          </div>
          <div className="rounded-[2rem] bg-gold-100 p-7">
            <p className="font-display text-2xl leading-tight text-brand-900">What happens next?</p>
            <ol className="mt-4 space-y-3 text-sm text-brand-900/80">
              {["We review your details", "A consultant calls or emails you within 24 hours", "We agree next steps together"].map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-900 text-xs text-white">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-cream py-20 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <SectionHeading eyebrow="FAQ" title={<>Common <span className="italic">questions</span></>} intro="Can't find your answer? Message us on WhatsApp during office hours." />
          <div className="divide-y divide-line border-y border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="reveal group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-display text-2xl text-brand-900 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-white transition-transform group-open:rotate-180">
                    <ChevronDown size={16} className="text-gold-700" />
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </>
  );
}
