import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { isValidObjectId } from "mongoose";
import { db } from "./db";
import { Job } from "./models";
import { EMPLOYMENT_TYPES } from "./site";
import type { JobDTO } from "./types";

export const JOBS_TAG = "jobs";

type Nullable<T> = { [K in keyof T]?: T[K] | null };
type JobDoc = Nullable<Omit<JobDTO, "id" | "createdAt">> & { _id: unknown; createdAt?: Date | string | null };

/** Public shape by default; pass includePrivate for admin (adds the client company). */
export function toJobDTO(j: JobDoc, includePrivate = false): JobDTO {
  return {
    ...(includePrivate ? { client: j.client ?? "" } : {}),
    id: String(j._id),
    title: j.title ?? "",
    education: j.education ?? "",
    gender: j.gender ?? "Any",
    salary: j.salary ?? "",
    industry: j.industry ?? "",
    location: j.location ?? "",
    employmentType: (EMPLOYMENT_TYPES as readonly string[]).includes(j.employmentType ?? "") ? j.employmentType! : "Full-time",
    experience: j.experience ?? "",
    otherInfo: j.otherInfo ?? "",
    jobCode: j.jobCode ?? "",
    openings: typeof j.openings === "number" && j.openings > 0 ? j.openings : null,
    department: j.department ?? "",
    workMode: j.workMode ?? "",
    timing: j.timing ?? "",
    ageRange: j.ageRange ?? "",
    skills: j.skills ?? "",
    isArchived: Boolean(j.isArchived),
    createdAt: new Date(j.createdAt ?? Date.now()).toISOString(),
  };
}

/** Public, cached list of open jobs. Admin changes call revalidateTag(JOBS_TAG). */
export async function getOpenJobs(): Promise<JobDTO[]> {
  "use cache";
  cacheTag(JOBS_TAG);
  cacheLife("hours");
  try {
    await db();
    const jobs = await Job.find({ isArchived: { $ne: true } }).sort({ createdAt: -1 }).limit(200).lean();
    return jobs.map((j) => toJobDTO(j as JobDoc));
  } catch (err) {
    console.error("getOpenJobs failed", err);
    cacheLife("seconds"); // don't keep an empty result around if the DB was unreachable
    return [];
  }
}

export async function getJob(id: string): Promise<JobDTO | null> {
  "use cache";
  cacheTag(JOBS_TAG);
  cacheLife("hours");
  if (!isValidObjectId(id)) return null;
  try {
    await db();
    const job = await Job.findById(id).lean();
    return job ? toJobDTO(job as JobDoc) : null;
  } catch (err) {
    console.error("getJob failed", err);
    cacheLife("seconds");
    return null;
  }
}
