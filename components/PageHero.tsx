import type { ReactNode } from "react";
import { Arc, Eyebrow } from "./ui";

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-cream">
      <Arc className="absolute -top-24 -right-24 h-80 w-80 opacity-70" />
      <div className="container-page relative py-16 text-center sm:py-24">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mx-auto mt-4 max-w-3xl text-5xl leading-[1.05] text-brand-900 sm:text-6xl lg:text-7xl">{title}</h1>
        {intro && <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
