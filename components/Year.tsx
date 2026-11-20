import { cacheLife } from "next/cache";

/** Current year, cached so it can be prerendered (Cache Components disallow raw new Date() in the shell). */
export async function Year() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
