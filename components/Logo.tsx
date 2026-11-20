import Image from "next/image";
import Link from "next/link";
import { cn } from "./ui";

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2", className)} aria-label="DishaHire home">
      <Image src="/emblem.png" alt="" width={40} height={40} priority unoptimized className="h-9 w-9" />
      <span className={cn("font-display text-[1.6rem] leading-none", light ? "text-white" : "text-brand-900")}>
        Disha<span className={light ? "text-gold-300" : "text-gold-700"}>Hire</span>
      </span>
    </Link>
  );
}
