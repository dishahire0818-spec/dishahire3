"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV } from "@/lib/site";
import { Logo } from "./Logo";
import { btn, cn, WhatsAppIcon } from "./ui";

/** The active-link state needs the URL, so it streams in; the fallback is the same header without highlighting. */
export type HeaderContact = { phone: string; phoneHref: string; whatsappUrl: string };

export function Header({ contact }: { contact: HeaderContact }) {
  return (
    <>
      <Suspense fallback={<HeaderView pathname={null} contact={contact} />}>
      <HeaderWithPath contact={contact} />
      </Suspense>
    </>
  );
}


function HeaderWithPath({ contact }: { contact: HeaderContact }) {
  return <HeaderView pathname={usePathname()} contact={contact} />;
}

function HeaderView({ pathname, contact }: { pathname: string | null; contact: HeaderContact }) {
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
    <>
    <header
      className={cn(
        "sticky top-0 z-50 bg-brand-950 text-white transition-shadow",
        scrolled ? "shadow-[0_1px_0_0_rgba(255,255,255,.08)]" : "",
      )}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6 sm:h-[5.25rem]">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm transition-colors",
                isActive(l.href) ? "bg-white/10 font-medium text-white" : "text-white/65 hover:text-white",
              )}
            >
              {l.name}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/jobs" className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white">
            Find a job
          </Link>
          <Link href="/contact?type=employer" className={btn.gold}>
            Hire talent
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 rounded-full p-2 text-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

    </header>
      {open && (
      <div id="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-brand-950 text-white md:hidden">
        <div className="container-page flex h-[4.5rem] shrink-0 items-center justify-between border-b border-white/10">
          <Logo />
          <button type="button" onClick={close} className="-mr-2 rounded-full p-2 text-white" aria-label="Close menu">
            <X size={24} />
          </button>
        </div>
        <nav aria-label="Mobile" className="container-page flex flex-1 flex-col py-4">
          {NAV.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={close}
              className={cn(
                "enter flex items-baseline justify-between border-b border-white/10 py-4 font-display text-4xl",
                isActive(l.href) ? "text-gold-300" : "text-white",
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {l.name}
              <span className="font-sans text-xs text-white/40">0{i + 1}</span>
            </Link>
          ))}
          <div className="mt-8 grid gap-3">
            <Link href="/contact?type=employer" onClick={close} className={cn(btn.gold, btn.lg)}>
              Hire talent
            </Link>
            <Link href="/jobs" onClick={close} className={cn(btn.outlineLight, btn.lg)}>
              Find a job
            </Link>
          </div>
          <div className="mt-auto flex items-center justify-between pt-10 text-sm text-white/60">
            <a href={contact.phoneHref}>{contact.phone}</a>
            <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-white">
              <WhatsAppIcon size={15} /> WhatsApp
            </a>
          </div>
        </nav>
      </div>
    )}
    </>
  );
}
