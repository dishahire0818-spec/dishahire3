"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV } from "@/lib/site";
import { Logo } from "./Logo";
import { btn, cn } from "./ui";

/** The active-link state needs the URL, so it streams in; the fallback is the same header without highlighting. */
export function Header() {
  return (
    <Suspense fallback={<HeaderView pathname={null} />}>
      <HeaderWithPath />
    </Suspense>
  );
}

function HeaderWithPath() {
  return <HeaderView pathname={usePathname()} />;
}

function HeaderView({ pathname }: { pathname: string | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname !== null && (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white/90 backdrop-blur transition-shadow",
        scrolled ? "shadow-[0_1px_0_0_var(--color-line)]" : "",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 sm:h-[4.5rem]">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm transition-colors",
                isActive(l.href) ? "bg-brand-50 font-medium text-brand-900" : "text-muted hover:text-brand-900",
              )}
            >
              {l.name}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/jobs" className="px-3 py-2 text-sm text-brand-900 hover:text-gold-700">
            Find a job
          </Link>
          <Link href="/contact?type=employer" className={btn.dark}>
            Hire talent
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 rounded-full p-2 text-brand-900 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-white md:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col py-4">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className={cn(
                  "border-b border-line py-4 font-display text-3xl",
                  isActive(l.href) ? "text-gold-700" : "text-brand-900",
                )}
              >
                {l.name}
              </Link>
            ))}
            <div className="mt-8 grid gap-3">
              <Link href="/contact?type=employer" onClick={close} className={cn(btn.dark, btn.lg)}>
                Hire talent
              </Link>
              <Link href="/jobs" onClick={close} className={cn(btn.outline, btn.lg)}>
                Find a job
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
