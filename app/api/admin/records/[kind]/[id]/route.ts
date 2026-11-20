import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { db } from "@/lib/db";
import { fail, json, requireAdmin, sameOrigin } from "@/lib/http";
import { Application, CandidateEnquiry, CompanyEnquiry, Resume } from "@/lib/models";

/** Permanently delete an enquiry/application (and its resume), e.g. on a data-deletion request. */
export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/admin/records/[kind]/[id]">) {
  if (!sameOrigin(req)) return fail("Forbidden", 403);
  if (!(await requireAdmin(req))) return fail("Unauthorized", 401);
  const { kind, id } = await ctx.params;
  if (!isValidObjectId(id)) return fail("Not found", 404);
  try {
    await db();
    let deleted: unknown = null;
    if (kind === "company") deleted = await CompanyEnquiry.findByIdAndDelete(id).lean();
    else if (kind === "candidate") deleted = await CandidateEnquiry.findByIdAndDelete(id).lean();
    else if (kind === "application") deleted = await Application.findByIdAndDelete(id).lean();
    else return fail("Not found", 404);
    const resumeId = (deleted as { resumeId?: unknown } | null)?.resumeId;
    if (resumeId) await Resume.findByIdAndDelete(resumeId);
    return json({ ok: true });
  } catch (err) {
    console.error("Delete record failed", err);
    return fail("Could not delete the record.", 500);
  }
}
