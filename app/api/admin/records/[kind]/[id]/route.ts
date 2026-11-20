import type { NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { db } from "@/lib/db";
import { fail, json, requireAdmin, sameOrigin } from "@/lib/http";
import { firstError, recordPatchSchema } from "@/lib/validation";
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

const MODELS = { company: CompanyEnquiry, candidate: CandidateEnquiry, application: Application } as const;

/** Pipeline updates: change stage/status, add or remove a private note. */
export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/admin/records/[kind]/[id]">) {
  if (!sameOrigin(req)) return fail("Forbidden", 403);
  const session = await requireAdmin(req);
  if (!session) return fail("Unauthorized", 401);
  const { kind, id } = await ctx.params;
  const Model = MODELS[kind as keyof typeof MODELS];
  if (!Model || !isValidObjectId(id)) return fail("Not found", 404);
  const parsed = recordPatchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return fail(firstError(parsed.error));
  const { stage, status, note, removeNoteId } = parsed.data;
  if (kind === "company" ? stage : status) return fail("Invalid field for this record type");

  const update: Record<string, unknown> = {};
  if (stage) update.$set = { stage };
  if (status) update.$set = { status };
  if (note) update.$push = { notes: { text: note, at: new Date(), by: session.email } };
  if (removeNoteId) update.$pull = { notes: { _id: removeNoteId } };
  try {
    await db();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- union of three models
    const doc = await (Model as any).findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!doc) return fail("Not found", 404);
    const { _id, ...rest } = doc as { _id: unknown };
    return json({ record: { ...JSON.parse(JSON.stringify(rest)), id: String(_id) } });
  } catch (err) {
    console.error("Update record failed", err);
    return fail("Could not update the record.", 500);
  }
}
