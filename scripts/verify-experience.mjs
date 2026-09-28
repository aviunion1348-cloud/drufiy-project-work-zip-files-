#!/usr/bin/env node
/** Dependency-free verification for the post-entry multi-page experience. */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pages = ["index.html", "lear.html", "prash.html", "method.html", "principles.html", "signal-map.html"];
const runtimeFiles = ["script.js", "post-entry.js", "interior.js", "scripts/dev-server.mjs", "scripts/package-release.mjs"];

function assert(condition, message) {
  if (!condition) throw new Error(message);
  console.log(`✓ ${message}`);
}

for (const file of runtimeFiles) {
  execFileSync(process.execPath, ["--check", join(root, file)], { stdio: "pipe" });
  console.log(`✓ ${file} parses`);
}

for (const pageName of pages) {
  const pagePath = join(root, pageName);
  assert(existsSync(pagePath), `${pageName} exists`);
  const html = readFileSync(pagePath, "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert(new Set(ids).size === ids.length, `${pageName} IDs are unique`);

  const localAssets = [...html.matchAll(/(?:href|src)="(\.\/[^"#?]+)"/g)].map((match) => match[1]);
  for (const asset of localAssets) {
    const assetPath = join(root, asset.slice(2));
    assert(existsSync(assetPath), `${pageName} resolves ${asset}`);
  }

  for (const target of [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1])) {
    assert(ids.includes(target), `${pageName} anchor #${target} resolves`);
  }

  assert(!/href="#"/.test(html), `${pageName} has no placeholder links`);
}

const index = readFileSync(join(root, "index.html"), "utf8");
assert((index.match(/<video\b/g) || []).length >= 7, "main experience contains at least seven live film surfaces");
assert(index.includes('name="name"') && index.includes('name="email"') && index.includes('name="message"'), "contact form preserves all three required fields");
assert(index.includes("Drufiy AI Private Limited") && index.includes("© 2026 DrufiyAI"), "legal identity and copyright remain present");
assert(index.includes("lear.html") && index.includes("prash.html"), "Lear and Prash route to dedicated pages");

for (const stylesheet of ["experience.css", "interior.css"]) {
  const css = readFileSync(join(root, stylesheet), "utf8");
  assert(css.split("{").length === css.split("}").length, `${stylesheet} braces balance`);
}

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
for (const script of ["dev", "start", "test", "build", "package"]) {
  assert(Boolean(packageJson.scripts?.[script]), `npm script ${script} exists`);
}
assert(Object.keys(packageJson.dependencies || {}).length === 0, "runtime has no third-party package dependency");

const archivePath = join(root, "releases", "drufiyai-ultra-immersive.zip");
if (existsSync(archivePath)) {
  assert(statSync(archivePath).size > 0, "downloadable ZIP is non-empty");
  const listing = execFileSync("unzip", ["-l", archivePath], { encoding: "utf8" });
  for (const file of ["package.json", ...pages]) assert(listing.includes(file), `ZIP contains ${file}`);
}

console.log("\nPost-entry experience verification complete.");
