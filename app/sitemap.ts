import type { MetadataRoute } from "next";
import { getOpenJobs } from "@/lib/data";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/services", "/jobs", "/contact"].map((p) => ({
    url: `${SITE.url}${p}`,
    changeFrequency: p === "/jobs" ? ("daily" as const) : ("monthly" as const),
    priority: p === "" ? 1 : p === "/jobs" ? 0.9 : 0.7,
  }));
  const jobs = (await getOpenJobs()).map((j) => ({
    url: `${SITE.url}/jobs/${j.id}`,
    lastModified: j.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  return [...pages, ...jobs];
}
