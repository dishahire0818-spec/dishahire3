import Link from "next/link";
import { Arc, btn, cn } from "./ui";

export function CtaSection() {
  return (
    <section className="container-page py-20 sm:py-28">
      <div className="relative grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="relative">
          <Arc className="absolute -top-10 -left-10 h-44 w-44 sm:-left-14" />
          <h2 className="relative pt-6 pl-8 text-4xl leading-tight text-brand-900 sm:text-6xl">
            Ready to choose the
            <br />
            <span className="italic text-gold-700">right direction?</span>
          </h2>
        </div>
        <div className="space-y-5 lg:pl-10">
          <p className="text-muted">
            Whether you are hiring or looking to be hired, tell us what you need. A consultant will get back to you
            within 24 hours.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/contact?type=employer" className={cn(btn.gold, btn.lg)}>
              I&apos;m hiring
            </Link>
            <Link href="/contact?type=candidate" className={cn(btn.outline, btn.lg)}>
              I&apos;m looking for a job
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
