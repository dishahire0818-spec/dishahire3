import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { fail, json, requireAdmin, sameOrigin } from "@/lib/http";
import { Setting } from "@/lib/models";
import { SETTINGS_TAG } from "@/lib/settings";
import { firstError, settingsSchema } from "@/lib/validation";

export async function PUT(req: NextRequest) {
  if (!sameOrigin(req)) return fail("Forbidden", 403);
  if (!(await requireAdmin(req))) return fail("Unauthorized", 401);
  const parsed = settingsSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return fail(firstError(parsed.error));
  const data = { ...parsed.data, contact: { ...parsed.data.contact, whatsapp: parsed.data.contact.whatsapp.replace(/\D/g, "") } };
  try {
    await db();
    await Setting.findOneAndUpdate({ key: "site" }, { $set: { data } }, { upsert: true });
    revalidateTag(SETTINGS_TAG, { expire: 0 });
    return json({ settings: data });
  } catch (err) {
    console.error("Save settings failed", err);
    return fail("Could not save the website content.", 500);
  }
}
