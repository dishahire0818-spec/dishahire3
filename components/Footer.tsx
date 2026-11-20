import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { CONTACT } from "@/lib/site";
import { Logo } from "./Logo";
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from "./ui";
import { Year } from "./Year";

const socials = [
  { label: "LinkedIn", href: CONTACT.linkedin, Icon: LinkedInIcon },
  { label: "Instagram", href: CONTACT.instagram, Icon: InstagramIcon },
  { label: "WhatsApp", href: CONTACT.whatsapp, Icon: WhatsAppIcon },
];

const COLUMNS = [
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Employers",
    links: [
      { name: "Hire talent", href: "/contact?type=employer" },
      { name: "Recruitment & staffing", href: "/services#recruitment" },
      { name: "HR consultancy", href: "/services#hr" },
    ],
  },
  {
    title: "Job seekers",
    links: [
      { name: "Browse jobs", href: "/jobs" },
      { name: "Submit your resume", href: "/contact?type=candidate" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="container-page grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Recruitment consultancy in Rajkot, Gujarat. Ethical, transparent hiring, and always free for job seekers.
          </p>
          <div className="mt-6 flex gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-brand-900 transition-colors hover:border-brand-900 hover:bg-brand-900 hover:text-white"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1.5fr]">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-brand-900 transition-colors hover:text-gold-700">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Contact</p>
            <ul className="mt-4 space-y-2.5 text-sm text-brand-900">
              <li>{CONTACT.address}</li>
              <li>
                <a href={CONTACT.phoneHref} className="hover:text-gold-700">{CONTACT.phone}</a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-gold-700">{CONTACT.email}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted sm:flex-row">
          <p>
            © <Year /> DishaHire Consultancy. All rights reserved.
          </p>
          <a href="#top" className="inline-flex items-center gap-1.5 hover:text-brand-900">
            Back to top <ArrowUp size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
