import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { CONTACT, SITE } from "@/lib/site";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-brand-900 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Header />
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
          email: CONTACT.email,
          telephone: CONTACT.phone,
          address: { "@type": "PostalAddress", addressLocality: CONTACT.city, addressRegion: CONTACT.region, addressCountry: "IN" },
          sameAs: [CONTACT.linkedin, CONTACT.instagram],
        }}
      />
    </>
  );
}
