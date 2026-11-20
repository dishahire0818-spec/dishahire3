// Downloads the site photos (Unsplash License: free for commercial use, no attribution required)
// into public/images so the site can self-host them. Then set USE_LOCAL_IMAGES = true in lib/site.ts.
// Usage: npm run download-images
import { mkdir, writeFile } from "node:fs/promises";

const PHOTOS = {
  consultant: "1573496359142-b8d87734a5a2",
  office: "1573161158971-d1b07323869a",
  meeting: "1516321318423-f06f85e504b3",
  building: "1486406146926-c627a92ad1ab",
  team: "1504384308090-c894fdcc538d",
  interview: "1600880292203-757bb62b4baf",
};

await mkdir("public/images", { recursive: true });
for (const [name, id] of Object.entries(PHOTOS)) {
  const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1600&fm=jpg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  await writeFile(`public/images/${name}.jpg`, Buffer.from(await res.arrayBuffer()));
  console.log(`saved public/images/${name}.jpg`);
}
