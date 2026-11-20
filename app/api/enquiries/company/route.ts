import { after, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { sendAlert } from "@/lib/email";
import { clientIp, fail, json, rateLimit } from "@/lib/http";
import { CompanyEnquiry } from "@/lib/models";
import { companySchema, firstError } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return fail("Invalid request.");
  if (body._gotcha) return json({ ok: true }); // honeypot: silently drop bots

  const parsed = companySchema.safeParse(body);
  if (!parsed.success) return fail(firstError(parsed.error));

  try {
    await db();
    if (!(await rateLimit(`form:${clientIp(req)}`, 10, 60 * 60))) {
      return fail("Too many submissions. Please try again later or contact us on WhatsApp.", 429);
    }
    await CompanyEnquiry.create(parsed.data);
  } catch (err) {
    console.error("Company enquiry failed", err);
    return fail("We couldn't save your request. Please try again or contact us on WhatsApp.", 500);
  }

  const d = parsed.data;
  after(() =>
    sendAlert(
      `New hiring enquiry: ${d.companyName}`,
      {
        Company: d.companyName,
        Type: d.companyType,
        Industry: d.industry,
        Location: d.address,
        Contact: `${d.contactName}${d.designation ? ` (${d.designation})` : ""}`,
        Email: d.email,
        Mobile: d.mobile,
        "Alternate number": d.alternateNumber,
        Website: d.website,
        Requirement: d.requirement,
      },
      d.email,
    ),
  );
  return json({ ok: true }, 201);
}
