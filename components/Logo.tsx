import Image from "next/image";
import Link from "next/link";
import { cn } from "./ui";

/**
 * Official DishaHire logo (full lockup with tagline). Light artwork, made for dark green backgrounds.
 * size: "md" for header/menus, "lg" for the footer.
 */
export function Logo({ size = "md", className }: { size?: "md" | "lg"; full?: boolean; light?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex shrink-0 items-center", className)} aria-label="DishaHire home">
      <Image
        src="/logo.png"
        alt="DishaHire: Right talent, right direction"
        width={size === "lg" ? 300 : 175}
        height={size === "lg" ? 103 : 60}
        priority={size === "md"}
        className={size === "lg" ? "h-auto w-[260px] sm:w-[300px]" : "h-12 w-auto sm:h-[3.75rem]"}
      />
    </Link>
  );
}
