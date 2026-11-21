import "server-only";
import { env } from "./env";
import { CONTACT, SITE } from "./site";

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Sends an alert via Resend. Silently skipped when RESEND_API_KEY isn't configured. */
export async function sendAlert(subject: string, fields: Record<string, unknown>, replyTo?: string) {
  const key = env("RESEND_API_KEY");
  if (!key) return;
  const rows = Object.entries(fields)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#5b6b6a;white-space:nowrap">${esc(k)}</td><td style="padding:6px 12px;color:#0b2a2a">${esc(v)}</td></tr>`,
    )
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;max-width:620px">
    <h2 style="color:#103838;font-weight:normal">${esc(subject)}</h2>
    <table style="border-collapse:collapse;font-size:14px">${rows}</table>
    <p style="margin-top:24px"><a href="${SITE.url}/admin" style="color:#8a6d2a">Open the admin dashboard →</a></p>
  </div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env("ALERT_EMAIL_FROM") || "DishaHire Website <onboarding@resend.dev>",
        to: (env("ALERT_EMAIL_TO") || CONTACT.email).split(",").map((s) => s.trim()),
        subject: `[DishaHire] ${subject}`,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("Resend error", res.status, await res.text());
  } catch (err) {
    console.error("Email alert failed", err);
  }
}
