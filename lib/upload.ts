import "server-only";
import { db } from "./db";
import { Media, Resume } from "./models";

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

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const IMAGE_TYPES: { mime: string; test: (b: Buffer) => boolean }[] = [
  { mime: "image/jpeg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: "image/png", test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: "image/webp", test: (b) => b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP" },
];

/** Validates (by file signature, not name) and stores a public image. */
export async function saveImage(file: FormDataEntryValue | null): Promise<{ id: string; url: string } | string> {
  if (!file || typeof file === "string" || file.size === 0) return "Choose an image to upload.";
  if (file.size > MAX_IMAGE_BYTES) return "Image must be 2 MB or smaller. Try a compressed JPG or WebP.";
  const buf = Buffer.from(await file.arrayBuffer());
  const type = IMAGE_TYPES.find((t) => t.test(buf));
  if (!type) return "Image must be a JPG, PNG or WebP file.";
  await db();
  const doc = await Media.create({
    filename: file.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120),
    contentType: type.mime,
    size: file.size,
    data: buf,
  });
  return { id: String(doc._id), url: `/api/media/${doc._id}` };
}
