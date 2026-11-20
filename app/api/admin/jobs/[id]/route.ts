import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { isValidObjectId } from "mongoose";
import { db } from "@/lib/db";
import { JOBS_TAG, toJobDTO } from "@/lib/data";
import { fail, json, requireAdmin, sameOrigin } from "@/lib/http";
import { Job } from "@/lib/models";
import { firstError, jobSchema } from "@/lib/validation";

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/admin/jobs/[id]">) {
  if (!sameOrigin(req)) return fail("Forbidden", 403);
  if (!(await requireAdmin(req))) return fail("Unauthorized", 401);
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return fail("Job not found", 404);
  const parsed = jobSchema.partial().safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return fail(firstError(parsed.error));
  try {
    await db();
    const job = await Job.findById(id);
    if (!job) return fail("Job not found", 404);
    // only apply fields that were actually sent
    const sent = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== undefined));
    job.set(sent);
    await job.save();
    revalidateTag(JOBS_TAG, { expire: 0 });
    return json({ job: toJobDTO(job.toObject(), true) });
  } catch (err) {
    console.error("Update job failed", err);
    return fail("Could not update the job.", 500);
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/admin/jobs/[id]">) {
  if (!sameOrigin(req)) return fail("Forbidden", 403);
  if (!(await requireAdmin(req))) return fail("Unauthorized", 401);
  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return fail("Job not found", 404);
  try {
    await db();
    await Job.findByIdAndDelete(id);
    revalidateTag(JOBS_TAG, { expire: 0 });
    return json({ ok: true });
  } catch (err) {
    console.error("Delete job failed", err);
    return fail("Could not delete the job.", 500);
  }
}
