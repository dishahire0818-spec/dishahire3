import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eye, Target } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { IndustryMarquee } from "@/components/Marquee";
import { SectionHeading } from "@/components/ui";
import { INDUSTRIES, VALUES } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "DishaHire is a Rajkot-based recruitment consultancy committed to ethical, transparent and result-oriented hiring. Learn about our mission, vision and values.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      {/* HERO: split statement + brand panel */}
      <section className="relative overflow-hidden">
        <div className="container-page grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <nav aria-label="Breadcrumb" className="enter text-sm text-muted">
              <Link href="/" className="hover:text-brand-900">Home</Link> <span className="mx-1.5">/</span> <span className="text-brand-900">About</span>
            </nav>
            <h1 className="enter mt-6 text-5xl leading-[0.98] text-brand-900 sm:text-7xl" style={{ animationDelay: "80ms" }}>
              We give hiring a <span className="text-shine">direction.</span>
            </h1>
            <p className="enter mt-6 max-w-lg text-lg leading-relaxed text-muted" style={{ animationDelay: "160ms" }}>
              DishaHire is a professional recruitment consultancy from Rajkot, Gujarat, bridging the gap between ambitious
              job seekers and forward-thinking employers through end-to-end recruitment.
            </p>
          </div>
          {/* Brand panel (no stock photos) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="enter col-span-2 flex min-h-64 flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-brand-950 px-6 py-12 sm:min-h-72" style={{ animationDelay: "120ms" }}>
              <Image src="/logo.png" alt="DishaHire: Right talent, right direction" width={360} height={124} className="h-auto w-[78%] max-w-[22rem]" priority />
            </div>
            <div className="enter rounded-[2rem] bg-cream p-6 sm:p-7" style={{ animationDelay: "220ms" }}>
              <p className="font-display text-3xl text-brand-950">દિશા</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                <span className="font-semibold text-brand-900">Disha</span> is Gujarati for <em>direction</em>, the promise in our name.
              </p>
            </div>
            <div className="enter rounded-[2rem] bg-brand-900 p-6 text-white sm:p-7" style={{ animationDelay: "320ms" }}>
              <p className="font-display text-5xl text-gold-300">15</p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">industries served across Gujarat and beyond</p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="border-t border-line bg-cream py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading index="01" eyebrow="Who we are" title={<>Hiring built on <span className="text-shine">trust</span></>} />
          <div className="reveal space-y-5 text-lg leading-relaxed text-brand-900/80">
            <p>
              Disha Hire is committed to <strong className="font-medium text-brand-900">ethical, transparent and result-oriented hiring</strong>.
              We work with startups, MSMEs and established companies to find people who fit, not just people who are available.
            </p>
            <p>
              We focus on long-term alignment instead of short-term placements, so every hire contributes to the growth of
              both the individual and the organisation. And for job seekers, our services are always free.
            </p>
            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              {[
                ["Transparency", "Honest updates at every step"],
                ["Client first", "Your brief, your timeline"],
                ["Free for seekers", "We never charge candidates"],
              ].map(([t, d]) => (
                <div key={t} className="border-t-2 border-gold-500 pt-3">
                  <p className="font-display text-xl text-brand-900">{t}</p>
                  <p className="text-sm text-muted">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="container-page grid gap-5 py-16 sm:py-20 md:grid-cols-2">
        <article className="reveal relative overflow-hidden rounded-[2rem] bg-brand-900 p-8 text-white sm:p-12">
          <Target className="text-gold-300" size={28} />
          <h2 className="mt-8 text-4xl sm:text-5xl">Our mission</h2>
          <p className="mt-5 text-lg leading-relaxed text-white/75">
            To empower careers and strengthen organisations by delivering high-quality, customised recruitment services that
            prioritise trust, efficiency and long-term success.
          </p>
        </article>
        <article className="reveal relative overflow-hidden rounded-[2rem] bg-gold-100 p-8 sm:p-12">
          <Eye className="text-gold-700" size={28} />
          <h2 className="mt-8 text-4xl text-brand-900 sm:text-5xl">Our vision</h2>
          <p className="mt-5 text-lg leading-relaxed text-brand-900/75">
            To become a leading job consulting firm recognised for integrity, professionalism and excellence across industries,
            setting a new benchmark in HR consultancy.
          </p>
        </article>
      </section>

      {/* VALUES: numbered editorial list */}
      <section className="border-y border-line py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading index="02" eyebrow="Foundation" title={<>The values we <span className="text-shine">hire by</span></>} intro="Five principles that guide every brief we take and every candidate we put forward." />
          </div>
          <ol className="divide-y divide-line border-y border-line">
            {VALUES.map((v, i) => (
              <li key={v.title} className="reveal group grid grid-cols-[4rem_1fr] items-baseline gap-4 py-7 sm:grid-cols-[5rem_1fr_1.2fr]">
                <span className="font-display text-4xl text-gold-500 transition-colors group-hover:text-gold-700">0{i + 1}</span>
                <h3 className="text-3xl text-brand-900">{v.title}</h3>
                <p className="col-start-2 text-muted sm:col-start-3">{v.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading index="03" eyebrow="Expertise" title={<>Industries we <span className="text-shine">serve</span></>} />
          <ul className="mt-10 flex flex-wrap gap-2.5">
            {INDUSTRIES.map((i) => (
              <li key={i} className="reveal rounded-full border border-line px-5 py-2.5 text-brand-900 transition-colors hover:border-brand-900 hover:bg-brand-900 hover:text-white">
                {i}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-16">
          <IndustryMarquee />
        </div>
      </section>

      <CtaSection title={<>Let&apos;s find your <span className="text-shine-light">next great hire</span></>} />
    </>
  );
}
