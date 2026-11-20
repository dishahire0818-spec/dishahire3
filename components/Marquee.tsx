import { INDUSTRIES } from "@/lib/site";
import { cn } from "./ui";

/** Infinite ticker of industries. Duplicated once so the loop is seamless. */
export function IndustryMarquee({ dark }: { dark?: boolean }) {
  const items = INDUSTRIES.map((i) => i.replace(/\s*\(.*\)/, ""));
  return (
    <div
      className={cn("group relative overflow-hidden border-y py-5 mask-fade-x", dark ? "border-white/10 text-white/80" : "border-line text-brand-900")}
      aria-label="Industries we serve"
    >
      <ul className="flex w-max animate-marquee gap-10 whitespace-nowrap group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[...items, ...items].map((name, i) => (
          <li key={i} aria-hidden={i >= items.length} className="flex items-center gap-10 font-display text-2xl sm:text-3xl">
            {name}
            <span className="text-base text-gold-500">✦</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
