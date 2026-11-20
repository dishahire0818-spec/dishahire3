// Usage: npm run hash-password -- "your-strong-password"
import { scrypt, randomBytes } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('Usage: npm run hash-password -- "a-strong-password (10+ chars)"');
  process.exit(1);
}
const salt = randomBytes(16);
scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (err, key) => {
  if (err) throw err;
  console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("base64url")}:${key.toString("base64url")}`);
  console.log(`JWT_SECRET=${randomBytes(32).toString("base64url")}   # (fresh random secret, if you need one)`);
});
