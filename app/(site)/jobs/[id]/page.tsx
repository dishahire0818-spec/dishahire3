import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Banknote, Building2, Clock, Users, Briefcase, CalendarDays, GraduationCap, MapPin, UserRound } from "lucide-react";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { JsonLd } from "@/components/JsonLd";
import { btn, cn, WhatsAppIcon } from "@/components/ui";
import { getJob } from "@/lib/data";
import { contactLinks, getSettings } from "@/lib/settings";
import { SITE } from "@/lib/site";
import type { JobDTO } from "@/lib/types";

export async function generateMetadata({ params }: PageProps<"/jobs/[id]">): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  if (!job || job.isArchived) return { title: "Job not found", robots: { index: false } };
  return {
    title: `${job.title}, ${job.location}`,
    description: `${job.title} job in ${job.location} (${job.industry}). ${job.education}. Salary: ${job.salary}. Apply online via DishaHire.`,
    alternates: { canonical: `/jobs/${job.id}` },
  };
}

export default function JobPage(props: PageProps<"/jobs/[id]">) {
  return (
    <Suspense fallback={<div className="container-page min-h-[60vh] py-24" aria-busy />}>
      <JobDetail params={props.params} />
    </Suspense>
  );
}

const EMPLOYMENT_SCHEMA: Record<string, string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACTOR",
  Temporary: "TEMPORARY",
  Internship: "INTERN",
};

/** Best-effort parse of salary text like "5-8 LPA" or "₹15,000 - ₹20,000 per month". */
function baseSalary(text: string) {
  const t = text.toLowerCase().replace(/,/g, "");
  // "10k" -> 10000
  const nums = [...t.matchAll(/(\d+(?:\.\d+)?)\s*(k\b)?/g)].map((m) => Number(m[1]) * (m[2] ? 1000 : 1));
  if (nums.length === 0) return undefined;
  const [min, max = min] = nums;
  if (/lpa|lakh|lac/.test(t)) {
    return { unitText: "YEAR", minValue: min * 100000, maxValue: max * 100000 };
  }
  if (/month|pm|p\.m|\/m/.test(t) || (min >= 1000 && max < 500000)) {
    return { unitText: "MONTH", minValue: min, maxValue: max };
  }
  return undefined;
}

function jobPostingLd(job: JobDTO) {
  const created = new Date(job.createdAt);
  const validThrough = new Date(created.getTime() + 60 * 86400000);
  // "Area, City, State" | "City, State" | "City"
  const parts = job.location.split(",").map((s) => s.trim()).filter(Boolean);
  const [street, city, region] = parts.length >= 3 ? parts : [undefined, parts[0], parts[1]];
  const salary = baseSalary(job.salary);
  const description =
    `<p>${escapeHtml(job.otherInfo || `${job.title} opening in ${job.location}.`).replace(/\n/g, "<br>")}</p>` +
    `<ul><li>Industry: ${escapeHtml(job.industry)}</li><li>Education: ${escapeHtml(job.education)}</li>` +
    (job.experience ? `<li>Experience: ${escapeHtml(job.experience)}</li>` : "") +
    `<li>Salary: ${escapeHtml(job.salary)}</li>` +
    (job.skills ? `<li>Skills: ${escapeHtml(job.skills)}</li>` : "") +
    (job.timing ? `<li>Timing: ${escapeHtml(job.timing)}</li>` : "") +
    `</ul>`;
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    identifier: { "@type": "PropertyValue", name: SITE.name, value: job.id },
    datePosted: created.toISOString().slice(0, 10),
    validThrough: validThrough.toISOString(),
    employmentType: EMPLOYMENT_SCHEMA[job.employmentType] ?? "FULL_TIME",
    hiringOrganization: { "@type": "Organization", name: SITE.name, sameAs: SITE.url, logo: `${SITE.url}/logo-full.png` },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(street ? { streetAddress: street } : {}),
        addressLocality: city || job.location,
        ...(region ? { addressRegion: region } : {}),
        addressCountry: "IN",
      },
    },
    educationRequirements: job.education,
    ...(job.openings ? { totalJobOpenings: job.openings } : {}),
    ...(job.skills ? { skills: job.skills } : {}),
    industry: job.industry,
    directApply: true,
    ...(salary
      ? { baseSalary: { "@type": "MonetaryAmount", currency: "INR", value: { "@type": "QuantitativeValue", ...salary } } }
      : {}),
  };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

async function JobDetail({ params }: { params: PageProps<"/jobs/[id]">["params"] }) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job || job.isArchived) notFound();
  const whatsappUrl = contactLinks((await getSettings()).contact).whatsappUrl;

  const whatsappText = encodeURIComponent(
    `Hi DishaHire team! I'd like to apply for this job:\n\n*Role:* ${job.title}\n*Location:* ${job.location}\n*Salary:* ${job.salary}\n\n${SITE.url}/jobs/${job.id}`,
  );
  const facts = [
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Banknote, label: "Salary", value: job.salary },
    { icon: Briefcase, label: "Job type", value: job.employmentType + (job.experience ? ` · ${job.experience}` : "") },
    { icon: GraduationCap, label: "Education", value: job.education },
    { icon: UserRound, label: "Open to", value: (job.gender === "Any" ? "All candidates" : job.gender) + (job.ageRange ? ` · Age ${job.ageRange}` : "") },
    ...(job.openings ? [{ icon: Users, label: "Openings", value: `${job.openings} position${job.openings > 1 ? "s" : ""}` }] : []),
    ...(job.workMode ? [{ icon: Building2, label: "Work mode", value: job.workMode }] : []),
    ...(job.timing ? [{ icon: Clock, label: "Timing", value: job.timing }] : []),
    {
      icon: CalendarDays,
      label: "Posted",
      value: new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    },
  ];

  return (
    <>
      <JsonLd data={jobPostingLd(job)} />
      <section className="relative overflow-hidden bg-brand-900 text-white">
        <div className="container-page relative py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-white/60">
            <Link href="/" className="hover:text-white">Home</Link> <span className="mx-1.5">/</span>{" "}
            <Link href="/jobs" className="hover:text-white">Jobs</Link> <span className="mx-1.5">/</span>{" "}
            <span className="text-white">{job.title}</span>
          </nav>
          <p className="mt-8 inline-block rounded-full border border-white/15 px-3 py-1 text-xs text-gold-300">{job.industry}</p>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[1.02] sm:text-7xl">{job.title}</h1>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-white/75">
            <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-gold-300" />{job.location}</span>
            <span className="inline-flex items-center gap-2"><Banknote size={16} className="text-gold-300" />{job.salary}</span>
            <span className="inline-flex items-center gap-2"><Briefcase size={16} className="text-gold-300" />{job.employmentType}</span>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#apply" className={cn(btn.gold, btn.lg)}>Apply now</a>
            <a href={`${whatsappUrl}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer" className={cn(btn.outlineLight, btn.lg)}>
              <WhatsAppIcon size={18} /> Apply on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_24rem] lg:gap-14">
        <div className="space-y-10">
          <dl className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3 bg-white p-5">
                <Icon size={18} className="mt-0.5 shrink-0 text-gold-700" />
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-muted">{label}</dt>
                  <dd className="mt-1 font-medium text-brand-900">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          {job.skills && (
            <div>
              <h2 className="text-3xl text-brand-900">Skills required</h2>
              <p className="mt-4 leading-relaxed text-muted">{job.skills}</p>
            </div>
          )}

          {job.otherInfo && (
            <div>
              <h2 className="text-3xl text-brand-900">About the role</h2>
              <div className="mt-4 whitespace-pre-line leading-relaxed text-muted">{job.otherInfo}</div>
            </div>
          )}

          <div id="apply" className="scroll-mt-24 rounded-[1.75rem] border border-line p-6 sm:p-8">
            <h2 className="text-3xl text-brand-900">Apply for this job</h2>
            <p className="mt-2 mb-6 text-sm text-muted">Takes about two minutes. Free for candidates, always.</p>
            <ApplyForm jobId={job.id} jobTitle={job.title} />
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[1.75rem] bg-brand-900 p-7 text-white">
            <p className="font-display text-3xl">Interested?</p>
            <p className="mt-2 text-sm text-white/70">Apply online with your resume, or message a consultant directly.</p>
            <div className="mt-6 grid gap-3">
              <a href="#apply" className={cn(btn.gold, btn.lg)}>
                Apply now
              </a>
              <a
                href={`${whatsappUrl}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(btn.outlineLight, btn.lg)}
              >
                <WhatsAppIcon size={18} /> Apply on WhatsApp
              </a>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-line p-6 text-sm text-muted">
            <p className="font-medium text-brand-900">Not the right fit?</p>
            <p className="mt-1">
              <Link href="/contact?type=candidate" className="text-gold-700 underline underline-offset-4">
                Share your profile
              </Link>{" "}
              and we&apos;ll match you with upcoming roles.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
