import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { contactLinks, getSettings } from "@/lib/settings";
import { Logo } from "./Logo";
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from "./ui";
import { Year } from "./Year";


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
      { name: "Career advice", href: "/updates" },
      { name: "Submit your resume", href: "/contact?type=candidate" },
    ],
  },
];

export async function Footer() {
  const { contact } = await getSettings();
  const links = contactLinks(contact);
  const socials = [
    { label: "LinkedIn", href: contact.linkedin, Icon: LinkedInIcon },
    { label: "Instagram", href: contact.instagram, Icon: InstagramIcon },
    { label: "WhatsApp", href: links.whatsappUrl, Icon: WhatsAppIcon },
  ].filter((s) => s.href);
  return (
    <footer className="mt-auto bg-brand-950 text-white">
      <div className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-xs">
          <Logo size="lg" />
          <p className="mt-6 text-sm leading-relaxed text-white/60">
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
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-gold-300 hover:text-gold-300"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1.5fr]">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/80 transition-colors hover:text-gold-300">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">Contact</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li>{contact.address}</li>
              <li>
                <a href={links.phoneHref} className="hover:text-gold-300">{contact.phone}</a>
              </li>
              <li>
                <a href={links.mailto} className="hover:text-gold-300">{contact.email}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/45 sm:flex-row">
          <p>
            © <Year /> DishaHire Consultancy. All rights reserved.
          </p>
          <a href="#top" className="inline-flex items-center gap-1.5 hover:text-white">
            Back to top <ArrowUp size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
