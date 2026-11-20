import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { toJobDTO } from "@/lib/data";
import { fail, json, requireAdmin } from "@/lib/http";
import { Application, CandidateEnquiry, CompanyEnquiry, Job } from "@/lib/models";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return fail("Unauthorized", 401);
  try {
    await db();
    const [jobs, companies, candidates, applications] = await Promise.all([
      Job.find().sort({ createdAt: -1 }).lean(),
      CompanyEnquiry.find().sort({ createdAt: -1 }).limit(2000).lean(),
      CandidateEnquiry.find().sort({ createdAt: -1 }).limit(2000).lean(),
      Application.find().sort({ createdAt: -1 }).limit(2000).lean(),
    ]);
    const plain = <T extends { _id: unknown }>(rows: T[]) =>
      rows.map(({ _id, ...rest }) => ({ ...JSON.parse(JSON.stringify(rest)), id: String(_id) }));
    return json({
      jobs: jobs.map((j) => toJobDTO(j as Parameters<typeof toJobDTO>[0])),
      companies: plain(companies),
      candidates: plain(candidates),
      applications: plain(applications),
    });
  } catch (err) {
    console.error("Admin data failed", err);
    return fail("Could not load data from the database.", 500);
  }
}
