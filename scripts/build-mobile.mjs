import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "www");

async function copy(name) {
  const src = path.join(root, name);
  if (existsSync(src)) await cp(src, path.join(out, name), { recursive: true });
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const name of ["index.html", "css", "js", "assets", "manifest.webmanifest", "sw.js"]) {
  await copy(name);
}

await writeFile(
  path.join(out, "native-build.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), source: "sianhi" }, null, 2),
  "utf8"
);

console.log("SIANHi mobile web bundle created in ./www");
