import Link from "next/link";
import { ArrowUp, Clock, Mail, MapPin, Phone } from "lucide-react";
import { contactLinks, getSettings } from "@/lib/settings";
import { Logo } from "./Logo";
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from "./ui";
import { Year } from "./Year";

const COLUMNS = [
  {
    title: "Company",
    links: [
      { name: "About us", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Updates", href: "/updates" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Employers",
    links: [
      { name: "Hire talent", href: "/contact?type=employer" },
      { name: "Recruitment", href: "/services#recruitment" },
      { name: "HR consultancy", href: "/services#hr" },
    ],
  },
  {
    title: "Job seekers",
    links: [
      { name: "Browse jobs", href: "/jobs" },
      { name: "Submit resume", href: "/contact?type=candidate" },
      { name: "Career advice", href: "/updates" },
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
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-4">
          <Logo size="lg" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
            Recruitment consultancy in Rajkot, Gujarat. Ethical hiring, always free for job seekers.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-gold-300 hover:bg-gold-400 hover:text-brand-950"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-3 gap-6 sm:col-span-2 lg:col-span-5">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-sm font-semibold text-white">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <Link href={l.href} className="text-white/55 transition-colors hover:text-gold-300">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Contact */}
        <div className="sm:col-span-2 lg:col-span-3">
          <p className="text-sm font-semibold text-white">Contact</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/55">
            <li>
              <a href={links.phoneHref} className="inline-flex items-center gap-2 transition-colors hover:text-gold-300">
                <Phone size={14} className="text-gold-300" /> {contact.phone}
              </a>
            </li>
            <li>
              <a href={links.mailto} className="inline-flex items-center gap-2 break-all transition-colors hover:text-gold-300">
                <Mail size={14} className="shrink-0 text-gold-300" /> {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="shrink-0 text-gold-300" /> {contact.address}
            </li>
            <li className="flex items-center gap-2">
              <Clock size={14} className="shrink-0 text-gold-300" /> {contact.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/45 sm:flex-row">
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
