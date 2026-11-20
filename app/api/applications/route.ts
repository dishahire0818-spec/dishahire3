import { after, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { sendAlert } from "@/lib/email";
import { clientIp, fail, json, rateLimit } from "@/lib/http";
import { Application, Job } from "@/lib/models";
import { saveResume } from "@/lib/upload";
import { applicationSchema, firstError, formToObject } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const fd = await req.formData().catch(() => null);
  if (!fd) return fail("Invalid request.");
  if (fd.get("_gotcha")) return json({ ok: true });

  const parsed = applicationSchema.safeParse(formToObject(fd));
  if (!parsed.success) return fail(firstError(parsed.error));
  const file = fd.get("resume");
  if (!(file instanceof File) || file.size === 0) return fail("Please attach your resume.");

  let jobTitle = "";
  try {
    await db();
    if (!(await rateLimit(`apply:${clientIp(req)}`, 10, 60 * 60))) {
      return fail("Too many applications. Please try again later or contact us on WhatsApp.", 429);
    }
    const job = await Job.findOne({ _id: parsed.data.jobId, isArchived: { $ne: true } }).lean();
    if (!job) return fail("This job is no longer open.", 404);
    jobTitle = job.title;
    const resume = await saveResume(file);
    if (typeof resume === "string") return fail(resume);
    await Application.create({ ...parsed.data, jobTitle, resumeId: resume?.id, resumeName: resume?.name });
  } catch (err) {
    console.error("Application failed", err);
    return fail("We couldn't submit your application. Please try again or apply on WhatsApp.", 500);
  }

  const d = parsed.data;
  after(() =>
    sendAlert(
      `New application: ${jobTitle}, ${d.name}`,
      {
        Job: jobTitle,
        Name: d.name,
        Email: d.email,
        Mobile: d.mobile,
        Location: d.location,
        Experience: d.experience,
        "Notice period": d.noticePeriod,
        Message: d.message,
        Resume: "Attached (download in admin)",
      },
      d.email,
    ),
  );
  return json({ ok: true }, 201);
}
