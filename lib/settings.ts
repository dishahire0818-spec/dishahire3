import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "./db";
import { Setting } from "./models";
import { CONTACT, FAQ } from "./site";

export const SETTINGS_TAG = "settings";

export type SiteSettings = {
  contact: {
    email: string;
    phone: string;
    whatsapp: string; // digits incl. country code, e.g. 918487998492
    address: string;
    hours: string;
    linkedin: string;
    instagram: string;
  };
  stats: { value: string; unit: string; label: string }[];
  faq: { q: string; a: string }[];
  testimonials: { quote: string; name: string; role: string }[];
  announcement: { text: string; href: string };
};

export const DEFAULT_SETTINGS: SiteSettings = {
  contact: {
    email: CONTACT.email,
    phone: CONTACT.phone,
    whatsapp: CONTACT.whatsapp.replace(/\D/g, ""),
    address: CONTACT.address,
    hours: CONTACT.hours,
    linkedin: CONTACT.linkedin,
    instagram: CONTACT.instagram,
  },
  stats: [
    { value: "15", unit: "", label: "industries served" },
    { value: "3–5", unit: "days", label: "to your first shortlist" },
    { value: "₹0", unit: "", label: "fees for job seekers" },
    { value: "24", unit: "hrs", label: "reply to every enquiry" },
  ],
  faq: FAQ,
  testimonials: [],
  announcement: { text: "", href: "" },
};

/** Derived links used across the UI. */
export function contactLinks(c: SiteSettings["contact"]) {
  return {
    phoneHref: `tel:${c.phone.replace(/[^\d+]/g, "")}`,
    whatsappUrl: `https://wa.me/${c.whatsapp.replace(/\D/g, "")}`,
    mailto: `mailto:${c.email}`,
  };
}

export function mergeSettings(data: Partial<SiteSettings> | null | undefined): SiteSettings {
  const d = data ?? {};
  return {
    contact: { ...DEFAULT_SETTINGS.contact, ...(d.contact ?? {}) },
    stats: d.stats?.length ? d.stats : DEFAULT_SETTINGS.stats,
    faq: d.faq?.length ? d.faq : DEFAULT_SETTINGS.faq,
    testimonials: d.testimonials ?? [],
    announcement: { ...DEFAULT_SETTINGS.announcement, ...(d.announcement ?? {}) },
  };
}

/** Editable website content. Falls back to the defaults above if the database is unreachable. */
export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag(SETTINGS_TAG);
  cacheLife("hours");
  try {
    await db();
    const doc = await Setting.findOne({ key: "site" }).lean();
    return mergeSettings(doc?.data as Partial<SiteSettings> | undefined);
  } catch (err) {
    console.error("getSettings failed, using defaults", err);
    cacheLife("minutes");
    return DEFAULT_SETTINGS;
  }
}
