import "server-only";
import { Resume } from "./models";

export const MAX_RESUME_BYTES = 2 * 1024 * 1024;

const TYPES: Record<string, { mime: string; magic: number[] }> = {
  pdf: { mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  docx: { mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", magic: [0x50, 0x4b, 0x03, 0x04] },
  doc: { mime: "application/msword", magic: [0xd0, 0xcf, 0x11, 0xe0] },
};

/** Validates and stores a resume. Returns null if no file was sent, or an error string. */
export async function saveResume(file: FormDataEntryValue | null): Promise<{ id: string; name: string } | null | string> {
  if (!file || typeof file === "string" || file.size === 0) return null;
  if (file.size > MAX_RESUME_BYTES) return "Resume must be 2 MB or smaller.";
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const type = TYPES[ext];
  if (!type) return "Resume must be a PDF or Word document.";
  const buf = Buffer.from(await file.arrayBuffer());
  if (!type.magic.every((b, i) => buf[i] === b)) return "That file doesn't look like a valid PDF or Word document.";
  const safeName = file.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120);
  const doc = await Resume.create({ filename: safeName, contentType: type.mime, size: file.size, data: buf });
  return { id: String(doc._id), name: safeName };
}
