// Turns the OpenNext build in `.open-next/` into a Cloudflare Pages upload (advanced mode):
// 1. bundles `.open-next/worker.js` into `.open-next/assets/_worker.js/`
// 2. writes `_routes.json` so static files skip the worker.
// Run after `opennextjs-cloudflare build`. Needs Node 22+ (wrangler).
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const assets = path.resolve(".open-next/assets");
const workerDir = path.join(assets, "_worker.js");
if (!existsSync(path.resolve(".open-next/worker.js"))) {
  throw new Error("Run `opennextjs-cloudflare build` first: .open-next/worker.js is missing.");
}

const bundleDir = path.resolve(".open-next/pages-worker");
rmSync(workerDir, { recursive: true, force: true });
rmSync(bundleDir, { recursive: true, force: true });
// wrangler's package "exports" hide bin/, so find it from its package.json instead.
const wranglerPackage = createRequire(import.meta.url).resolve("wrangler/package.json");
const wrangler = path.join(path.dirname(wranglerPackage), "bin", "wrangler.js");
execFileSync(
  process.execPath,
  [wrangler, "deploy", "--dry-run", "--config", "wrangler.worker.jsonc", "--outdir", bundleDir],
  { stdio: "inherit" },
);
// Pages advanced mode wants `_worker.js/index.js`; keep any extra modules (e.g. .wasm) beside it.
mkdirSync(workerDir);
for (const name of readdirSync(bundleDir)) {
  if (name.endsWith(".map") || name === "README.md") continue;
  copyFileSync(path.join(bundleDir, name), path.join(workerDir, name === "worker.js" ? "index.js" : name));
}

const exclude = readdirSync(assets)
  .filter((name) => !name.startsWith("_worker.js") && name !== "_routes.json" && name !== "BUILD_ID")
  .map((name) => (statSync(path.join(assets, name)).isDirectory() ? `/${name}/*` : `/${name}`));
writeFileSync(path.join(assets, "_routes.json"), JSON.stringify({ version: 1, include: ["/*"], exclude }, null, 2));
console.log(`Pages bundle ready. Static paths skipping the worker: ${exclude.join(", ")}`);
