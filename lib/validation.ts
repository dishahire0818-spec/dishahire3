import { z } from "zod";
import { COMPANY_TYPES, EMPLOYMENT_TYPES } from "./site";

const text = (max = 120) => z.string().trim().max(max);
const required = (label: string, max = 120) => text(max).min(1, `${label} is required`);
const optional = (max = 120) => text(max).optional().default("");
const email = z.string().trim().toLowerCase().max(160).email("Enter a valid email address");
const phone = z
  .string()
  .trim()
  .max(20)
  .regex(/^[+()\d\s-]{7,20}$/, "Enter a valid phone number");

export const companySchema = z.object({
  companyName: required("Company name"),
  companyType: z.enum(COMPANY_TYPES as [string, ...string[]], { message: "Choose a company type" }),
  industry: required("Industry"),
  address: required("Company location", 200),
  contactName: required("Contact name"),
  designation: optional(),
  email,
  mobile: phone,
  alternateNumber: z.union([z.literal(""), phone]).optional().default(""),
  website: optional(200),
  requirement: optional(1500),
});

export const candidateSchema = z.object({
  name: required("Full name"),
  email,
  mobile: phone,
  location: required("Current location"),
  qualification: required("Highest qualification"),
  passingYear: z.string().trim().regex(/^(19|20)\d{2}$/, "Enter a valid year, e.g. 2022"),
  preferredRole: required("Preferred role"),
  preferredIndustry: optional(),
  experience: optional(40),
  currentTitle: optional(),
  expectedSalary: optional(40),
  noticePeriod: optional(40),
  dob: optional(20),
});

export const applicationSchema = z.object({
  jobId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid job"),
  name: required("Full name"),
  email,
  mobile: phone,
  location: required("Current location"),
  experience: optional(40),
  noticePeriod: optional(40),
  message: optional(1500),
});

export const jobSchema = z.object({
  title: required("Job title"),
  industry: required("Industry"),
  location: required("Location"),
  education: required("Education"),
  salary: required("Salary"),
  gender: z.enum(["Any", "Male", "Female"]).default("Any"),
  employmentType: z.enum(EMPLOYMENT_TYPES).default("Full-time"),
  experience: optional(60),
  otherInfo: optional(5000),
  jobCode: optional(30),
  openings: z.coerce.number().int().min(1).max(10000).optional().nullable(),
  department: optional(80),
  workMode: optional(40),
  timing: optional(60),
  ageRange: optional(40),
  skills: optional(500),
  client: optional(120),
  isArchived: z.boolean().optional(),
});

export function firstError(err: z.ZodError) {
  return err.issues[0]?.message ?? "Please check the form and try again.";
}

/** FormData -> plain object of strings (files skipped). */
export function formToObject(fd: FormData) {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string") out[k] = v;
  return out;
}

const url = z.union([z.literal(""), z.string().trim().max(300).regex(/^https?:\/\/\S+$/, "Links must start with https://")]);

export const recordPatchSchema = z
  .object({
    stage: z.enum(["new", "shortlisted", "interview", "hired", "rejected"]).optional(),
    status: z.enum(["new", "contacted", "discussion", "converted", "closed"]).optional(),
    note: z.string().trim().min(1).max(2000).optional(),
    removeNoteId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  })
  .refine((v) => Object.values(v).some((x) => x !== undefined), "Nothing to update");

export const postSchema = z.object({
  title: required("Title", 160),
  slug: z.string().trim().max(80).regex(/^[a-z0-9-]*$/, "Slug can only contain lowercase letters, numbers and dashes").optional().default(""),
  category: required("Category", 60),
  excerpt: optional(300),
  content: z.string().max(50000).default(""),
  coverId: z.union([z.literal(""), z.string().regex(/^[a-f\d]{24}$/i)]).nullable().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const settingsSchema = z.object({
  contact: z.object({
    email,
    phone,
    whatsapp: z.string().trim().regex(/^\+?[\d\s-]{10,16}$/, "WhatsApp number must include the country code, e.g. 918487998492"),
    address: required("Address", 200),
    hours: required("Office hours", 80),
    linkedin: url,
    instagram: url,
  }),
  stats: z
    .array(z.object({ value: required("Number", 12), unit: optional(12), label: required("Label", 60) }))
    .length(4, "Exactly 4 numbers are shown on the home page"),
  faq: z.array(z.object({ q: required("Question", 200), a: required("Answer", 1500) })).max(20),
  testimonials: z.array(z.object({ quote: required("Quote", 600), name: required("Name", 80), role: optional(120) })).max(12),
  announcement: z.object({ text: optional(160), href: z.union([z.literal(""), z.string().trim().max(300).regex(/^(\/|https?:\/\/)\S*$/, "Link must start with / or https://")]) }),
});
