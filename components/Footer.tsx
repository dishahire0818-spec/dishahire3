import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, NAV } from "@/lib/site";
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from "./ui";
import { Year } from "./Year";

const socials = [
  { label: "LinkedIn", href: CONTACT.linkedin, Icon: LinkedInIcon },
  { label: "Instagram", href: CONTACT.instagram, Icon: InstagramIcon },
  { label: "WhatsApp", href: CONTACT.whatsapp, Icon: WhatsAppIcon },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="container-page grid gap-10 pt-14 pb-8 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div className="max-w-sm space-y-4">
          <p className="font-display text-2xl text-brand-900">Right talent, right direction.</p>
          <p className="text-sm leading-relaxed text-muted">
            A recruitment consultancy from Rajkot connecting people and organisations through ethical, transparent,
            result-oriented hiring.
          </p>
          <div className="flex gap-2 pt-1">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-brand-900 transition-colors hover:border-brand-900 hover:bg-brand-900 hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <nav aria-label="Footer">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-gold-700">Explore</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-brand-900 hover:text-gold-700">
                  {l.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact?type=candidate" className="text-brand-900 hover:text-gold-700">
                Submit resume
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-gold-700">Contact</p>
          <ul className="space-y-3 text-sm text-brand-900">
            <li className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-700" /> {CONTACT.address}
            </li>
            <li className="flex gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-gold-700" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-gold-700">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-gold-700" />
              <a href={CONTACT.phoneHref} className="hover:text-gold-700">
                {CONTACT.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Giant wordmark, as in the reference */}
      <div className="container-page overflow-hidden" aria-hidden>
        <div className="flex select-none items-end justify-center gap-[2vw] pt-4 leading-[0.8]">
          <Image src="/emblem.png" alt="" width={160} height={160} unoptimized className="mb-[1.5vw] h-[11vw] max-h-40 w-auto" />
          <span className="font-display text-[19vw] tracking-tight text-brand-900 lg:text-[13.5rem]">
            Disha<span className="italic text-gold-500">Hire</span>
          </span>
        </div>
      </div>

      <div className="bg-brand-900 text-white/70">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs sm:flex-row">
          <p>
            © <Year /> DishaHire Consultancy
          </p>
          <p>All rights reserved</p>
          <a href="#top" className="inline-flex items-center gap-1.5 hover:text-white">
            <ArrowUp size={14} /> To top
          </a>
        </div>
      </div>
    </footer>
  );
}
