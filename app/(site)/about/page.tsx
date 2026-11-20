import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Gem, Handshake, ShieldCheck, Target, TrendingUp, Users } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { PageHero } from "@/components/PageHero";
import { cn, Eyebrow } from "@/components/ui";
import { PHOTOS, VALUES } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "DishaHire is a Rajkot-based recruitment consultancy committed to ethical, transparent and result-oriented hiring. Learn about our mission, vision and values.",
  alternates: { canonical: "/about" },
};

const VALUE_ICONS = [ShieldCheck, Target, Gem, Users, TrendingUp];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About DishaHire"
        title={
          <>
            Your trusted <span className="italic text-gold-700">hiring partner</span>
          </>
        }
        intro="Bridging the gap between ambitious job seekers and forward-thinking employers through end-to-end recruitment."
      />

      <section className="container-page grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2">
        <div>
          <Eyebrow>Who we are</Eyebrow>
          <h2 className="mt-3 text-4xl leading-tight text-brand-900 sm:text-5xl">
            Hiring built on <span className="italic">trust</span>
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-muted">
            <p>
              Disha Hire is a professional recruitment consultancy committed to{" "}
              <strong className="font-medium text-brand-900">ethical, transparent and result-oriented hiring</strong>.
            </p>
            <p>
              We focus on long-term alignment instead of short-term placements, so every hire contributes to the growth
              of both the individual and the organisation. &ldquo;Disha&rdquo; means direction, and that is what we aim
              to give every client and candidate.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { icon: Handshake, label: "Transparency" },
              { icon: Users, label: "Client first" },
              { icon: ShieldCheck, label: "No fees for candidates" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-brand-900">
                <Icon size={16} className="text-gold-700" /> {label}
              </span>
            ))}
          </div>
        </div>
        <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem] bg-brand-100">
          <Image src={PHOTOS.office} alt="DishaHire consultants at work" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="bg-brand-900 py-20 text-white sm:py-28">
        <div className="container-page grid gap-5 md:grid-cols-2">
          {[
            {
              icon: Target,
              title: "Our mission",
              body: "To empower careers and strengthen organisations by delivering high-quality, customised recruitment services that prioritise trust, efficiency and long-term success.",
            },
            {
              icon: Eye,
              title: "Our vision",
              body: "To become a leading job consulting firm recognised for integrity, professionalism and excellence across industries, setting a new benchmark in HR consultancy.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-[1.75rem] border border-white/12 bg-white/[0.03] p-8 sm:p-12">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-500 text-brand-950">
                <Icon size={22} />
              </span>
              <h2 className="mt-6 text-4xl">{title}</h2>
              <p className="mt-4 leading-relaxed text-white/75">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Foundation</Eyebrow>
          <h2 className="mt-3 text-4xl text-brand-900 sm:text-5xl">Our values</h2>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {VALUES.map((v, i) => {
            const Icon = VALUE_ICONS[i];
            return (
              <li key={v.title} className={cn("rounded-2xl p-6", i % 2 ? "bg-brand-50" : "bg-gold-100")}>
                <Icon size={22} className="text-brand-900" />
                <h3 className="mt-5 text-2xl text-brand-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.desc}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="border-t border-line">
        <CtaSection />
      </div>
    </>
  );
}
