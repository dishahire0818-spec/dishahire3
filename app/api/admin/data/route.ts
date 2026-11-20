import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { toJobDTO } from "@/lib/data";
import { fail, json, requireAdmin } from "@/lib/http";
import { Application, CandidateEnquiry, CompanyEnquiry, Job, Post, Setting } from "@/lib/models";
import { toPostDTO } from "@/lib/posts";
import { mergeSettings, type SiteSettings } from "@/lib/settings";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return fail("Unauthorized", 401);
  try {
    await db();
    const [jobs, companies, candidates, applications, posts, setting] = await Promise.all([
      Job.find().sort({ createdAt: -1 }).lean(),
      CompanyEnquiry.find().sort({ createdAt: -1 }).limit(2000).lean(),
      CandidateEnquiry.find().sort({ createdAt: -1 }).limit(2000).lean(),
      Application.find().sort({ createdAt: -1 }).limit(2000).lean(),
      Post.find().sort({ updatedAt: -1 }).limit(500).lean(),
      Setting.findOne({ key: "site" }).lean(),
    ]);
    const plain = <T extends { _id: unknown }>(rows: T[]) =>
      rows.map(({ _id, ...rest }) => ({ ...JSON.parse(JSON.stringify(rest)), id: String(_id) }));
    return json({
      jobs: jobs.map((j) => toJobDTO(j as Parameters<typeof toJobDTO>[0], true)),
      companies: plain(companies),
      candidates: plain(candidates),
      applications: plain(applications),
      posts: posts.map((p) => toPostDTO(p as Parameters<typeof toPostDTO>[0])),
      settings: mergeSettings(setting?.data as Partial<SiteSettings> | undefined),
    });
  } catch (err) {
    console.error("Admin data failed", err);
    return fail("Can't load data: the database is not connected. Open /api/health to see what to fix in Vercel.", 500);
  }
}
