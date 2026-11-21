/**
 * Reads an environment variable defensively: trims spaces/newlines, strips surrounding quotes,
 * and removes an accidental "NAME=" prefix (common when pasting .env lines into Vercel's value box).
 */
export function env(name: string): string {
  let v = (process.env[name] ?? "").trim();
  if (v.startsWith(`${name}=`)) v = v.slice(name.length + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1).trim();
  return v;
}
