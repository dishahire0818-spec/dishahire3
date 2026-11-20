import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { JOBS_TAG } from "@/lib/data";
import { fail, json, requireAdmin, sameOrigin } from "@/lib/http";
import { Job } from "@/lib/models";
import { firstError, jobSchema } from "@/lib/validation";

const bodySchema = z.object({ jobs: z.array(z.unknown()).min(1, "No jobs to import").max(500, "Import at most 500 jobs at a time") });

/** Bulk import (from the office Excel sheet). Jobs with an existing job code are updated, not duplicated. */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("Forbidden", 403);
  if (!(await requireAdmin(req))) return fail("Unauthorized", 401);
  const body = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!body.success) return fail(firstError(body.error));

  const valid: z.infer<typeof jobSchema>[] = [];
  const errors: { row: number; error: string }[] = [];
  body.data.jobs.forEach((raw, i) => {
    const parsed = jobSchema.safeParse(raw);
    if (parsed.success) valid.push(parsed.data);
    else errors.push({ row: i + 1, error: firstError(parsed.error) });
  });
  if (valid.length === 0) return json({ created: 0, updated: 0, errors }, 400);

  try {
    await db();
    let created = 0;
    let updated = 0;
    for (const job of valid) {
      const data = { ...job, isArchived: false };
      if (job.jobCode) {
        const res = await Job.updateOne({ jobCode: job.jobCode }, { $set: data, $setOnInsert: { createdAt: new Date() } }, { upsert: true, runValidators: true });
        if (res.upsertedCount) created++;
        else updated++;
      } else {
        await Job.create(data);
        created++;
      }
    }
    revalidateTag(JOBS_TAG, { expire: 0 });
    return json({ created, updated, errors });
  } catch (err) {
    console.error("Job import failed", err);
    return fail("Could not import the jobs. Check the database connection.", 500);
  }
}
