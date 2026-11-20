import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";
import { contactLinks, getSettings } from "@/lib/settings";
import { CONTACT, SITE } from "@/lib/site";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { contact, announcement } = await getSettings();
  const links = contactLinks(contact);
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-brand-900 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      {announcement.text && (
        <div className="bg-brand-900 px-4 py-2.5 text-center text-sm text-white/85">
          {announcement.href ? (
            <Link href={announcement.href} className="hover:text-white">
              {announcement.text} <span className="text-gold-300">→</span>
            </Link>
          ) : (
            announcement.text
          )}
        </div>
      )}
      <Header contact={{ phone: contact.phone, phoneHref: links.phoneHref, whatsappUrl: links.whatsappUrl }} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "EmploymentAgency",
          name: SITE.name,
          slogan: SITE.tagline,
          url: SITE.url,
          logo: `${SITE.url}/logo-full.png`,
          email: contact.email,
          telephone: contact.phone,
          address: { "@type": "PostalAddress", addressLocality: CONTACT.city, addressRegion: CONTACT.region, addressCountry: "IN" },
          sameAs: [contact.linkedin, contact.instagram].filter(Boolean),
        }}
      />
    </>
  );
}
