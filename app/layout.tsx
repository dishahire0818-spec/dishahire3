import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Inter_Tight({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-inter-tight", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: Recruitment Consultancy in Rajkot, Gujarat`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { type: "website", siteName: SITE.name, locale: SITE.locale, url: SITE.url },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#103838" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${display.variable}`}>
      <body id="top" className="flex min-h-dvh flex-col">
        {children}
      </body>
    </html>
  );
}
