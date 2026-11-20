import Link from "next/link";
import { ArrowUp, ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
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
    title: "For employers",
    links: [
      { name: "Hire talent", href: "/contact?type=employer" },
      { name: "Recruitment", href: "/services#recruitment" },
      { name: "Talent sourcing", href: "/services#sourcing" },
      { name: "HR consultancy", href: "/services#hr" },
    ],
  },
  {
    title: "For job seekers",
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
  const quick = [
    { label: "Call", value: contact.phone, href: links.phoneHref, Icon: Phone },
    { label: "WhatsApp", value: "Chat with us", href: links.whatsappUrl, Icon: WhatsAppIcon, external: true },
    { label: "Email", value: contact.email, href: links.mailto, Icon: Mail },
  ];

  return (
    <footer className="mt-auto bg-brand-950 text-white">
      <div className="container-page pt-16 pb-10 sm:pt-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Logo size="lg" />
            <p className="mt-7 max-w-sm text-[0.95rem] leading-relaxed text-white/60">
              A recruitment consultancy from Rajkot, Gujarat. Ethical, transparent hiring for employers, and always free
              for job seekers.
            </p>
            <ul className="mt-8 grid max-w-md gap-2.5">
              {quick.map(({ label, value, href, Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-gold-300/50 hover:bg-white/[0.06]"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold-400 text-brand-950">
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-white/45">{label}</span>
                      <span className="block truncate text-sm font-medium text-white">{value}</span>
                    </span>
                    <ArrowUpRight size={16} className="shrink-0 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-300" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-12 lg:col-span-7 lg:pl-10">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="text-sm font-semibold text-white">{col.title}</p>
                <ul className="mt-5 space-y-3.5 text-[0.95rem]">
                  {col.links.map((l) => (
                    <li key={l.name}>
                      <Link href={l.href} className="text-white/60 transition-colors hover:text-gold-300">
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:mt-auto">
            {[
              { k: "Hiring?", t: "Share your requirement", href: "/contact?type=employer" },
              { k: "Looking for a job?", t: "Browse open roles", href: "/jobs" },
            ].map((c) => (
              <Link key={c.href} href={c.href} className="group flex items-center justify-between gap-4 bg-brand-950 p-6 transition-colors hover:bg-brand-900">
                <span>
                  <span className="block text-xs text-white/45">{c.k}</span>
                  <span className="mt-1 block font-display text-lg text-white">{c.t}</span>
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-400 text-brand-950 transition-transform group-hover:translate-x-0.5">
                  <ArrowUpRight size={17} />
                </span>
              </Link>
            ))}
          </div>
          </div>
        </div>

        {/* Info strip */}
        <div className="mt-16 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-3">
          <div className="flex gap-3.5">
            <MapPin size={18} className="mt-0.5 shrink-0 text-gold-300" />
            <div>
              <p className="text-xs text-white/45">Office</p>
              <p className="mt-0.5 text-sm text-white/85">{contact.address}</p>
            </div>
          </div>
          <div className="flex gap-3.5">
            <Clock size={18} className="mt-0.5 shrink-0 text-gold-300" />
            <div>
              <p className="text-xs text-white/45">Office hours</p>
              <p className="mt-0.5 text-sm text-white/85">{contact.hours}</p>
            </div>
          </div>
          <div className="sm:justify-self-end">
            <p className="text-xs text-white/45">Follow us</p>
            <div className="mt-2 flex gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-gold-300 hover:bg-gold-400 hover:text-brand-950"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/45 sm:flex-row">
          <p>
            © <Year /> DishaHire Consultancy. All rights reserved.
          </p>
          <a href="#top" className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 transition-colors hover:border-white/30 hover:text-white">
            Back to top <ArrowUp size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
