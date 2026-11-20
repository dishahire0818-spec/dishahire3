import { after, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { sendAlert } from "@/lib/email";
import { clientIp, fail, json, rateLimit } from "@/lib/http";
import { CandidateEnquiry } from "@/lib/models";
import { saveResume } from "@/lib/upload";
import { candidateSchema, firstError, formToObject } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const fd = await req.formData().catch(() => null);
  if (!fd) return fail("Invalid request.");
  if (fd.get("_gotcha")) return json({ ok: true });

  const parsed = candidateSchema.safeParse(formToObject(fd));
  if (!parsed.success) return fail(firstError(parsed.error));

  try {
    await db();
    if (!(await rateLimit(`form:${clientIp(req)}`, 10, 60 * 60))) {
      return fail("Too many submissions. Please try again later or contact us on WhatsApp.", 429);
    }
    const resume = await saveResume(fd.get("resume"));
    if (typeof resume === "string") return fail(resume);
    await CandidateEnquiry.create({ ...parsed.data, resumeId: resume?.id, resumeName: resume?.name });
  } catch (err) {
    console.error("Candidate enquiry failed", err);
    return fail("We couldn't save your profile. Please try again or contact us on WhatsApp.", 500);
  }

  const d = parsed.data;
  after(() =>
    sendAlert(
      `New candidate profile: ${d.name}`,
      {
        Name: d.name,
        Email: d.email,
        Mobile: d.mobile,
        Location: d.location,
        Qualification: `${d.qualification} (${d.passingYear})`,
        "Preferred role": d.preferredRole,
        "Preferred industry": d.preferredIndustry,
        Experience: d.experience,
        "Notice period": d.noticePeriod,
        Resume: fd.get("resume") instanceof File && (fd.get("resume") as File).size > 0 ? "Attached (download in admin)" : "Not attached",
      },
      d.email,
    ),
  );
  return json({ ok: true }, 201);
}
