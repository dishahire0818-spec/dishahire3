import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { JOBS_TAG, toJobDTO } from "@/lib/data";
import { fail, json, requireAdmin, sameOrigin } from "@/lib/http";
import { Job } from "@/lib/models";
import { firstError, jobSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("Forbidden", 403);
  if (!(await requireAdmin(req))) return fail("Unauthorized", 401);
  const parsed = jobSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return fail(firstError(parsed.error));
  try {
    await db();
    const job = await Job.create({ ...parsed.data, isArchived: false });
    revalidateTag(JOBS_TAG, { expire: 0 });
    return json({ job: toJobDTO(job.toObject(), true) }, 201);
  } catch (err) {
    console.error("Create job failed", err);
    return fail("Could not create the job.", 500);
  }
}
