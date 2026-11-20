import type { Metadata } from "next";
import { Suspense } from "react";
import { ChevronDown, Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactTabs } from "@/components/ContactTabs";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { btn, cn, WhatsAppIcon } from "@/components/ui";
import { CONTACT, FAQ } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Hiring or looking for a job? Contact DishaHire in Rajkot, Gujarat. Share your requirement or submit your resume, and a consultant will reply within 24 hours.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const details = [
    { icon: MapPin, label: "Office", value: CONTACT.address },
    { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: Phone, label: "Phone", value: CONTACT.phone, href: CONTACT.phoneHref },
    { icon: Clock, label: "Hours", value: CONTACT.hours },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s start a <span className="italic text-gold-700">conversation</span>
          </>
        }
        intro="Tell us whether you're hiring or looking for your next role. A consultant will reply within 24 hours."
      />

      <section className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <div className="rounded-[1.75rem] border border-line p-4 sm:p-8">
          <Suspense fallback={<div className="h-[40rem] animate-pulse rounded-2xl bg-cream" />}>
            <ContactTabs />
          </Suspense>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[1.75rem] bg-brand-900 p-7 text-white">
            <h2 className="text-3xl">
              Direct <span className="italic text-gold-300">connect</span>
            </h2>
            <ul className="mt-6 space-y-5">
              {details.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-gold-300">
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.14em] text-white/55">{label}</p>
                    {href ? (
                      <a href={href} className="break-words text-sm hover:text-gold-300">
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.75rem] border border-line p-7">
            <p className="font-display text-2xl text-brand-900">Need a quick answer?</p>
            <p className="mt-2 text-sm text-muted">Our consultants are available on WhatsApp during office hours.</p>
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className={cn(btn.gold, "mt-5 w-full")}>
              <WhatsAppIcon size={16} /> Chat on WhatsApp
            </a>
          </div>
        </aside>
      </section>

      <section className="border-t border-line bg-cream py-20 sm:py-24">
        <div className="container-page max-w-3xl">
          <h2 className="text-center text-4xl text-brand-900 sm:text-5xl">Common questions</h2>
          <div className="mt-10 divide-y divide-line rounded-[1.75rem] border border-line bg-white">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-6 py-5 sm:px-8">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-brand-900 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown size={18} className="shrink-0 text-gold-700 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
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
