import "server-only";
import { scrypt, timingSafeEqual, randomBytes } from "node:crypto";

// Format: scrypt:<salt base64url>:<hash base64url>  (no "$" so it is safe in .env files)
const KEYLEN = 64;

function derive(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, KEYLEN, { N: 16384, r: 8, p: 1 }, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await derive(password, salt);
  return `scrypt:${salt.toString("base64url")}:${key.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string | undefined) {
  if (!stored) return false;
  const [algo, saltB64, hashB64] = stored.split(":");
  if (algo !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64url");
  const key = await derive(password, Buffer.from(saltB64, "base64url"));
  return key.length === expected.length && timingSafeEqual(key, expected);
}
