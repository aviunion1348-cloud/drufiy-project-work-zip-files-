#!/usr/bin/env node
/** Dependency-free U-01 verification. */

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "index.html",
  "styles.css",
  "script.js",
  "design-system/tokens.css",
  "design-system/tokens.json",
  "design-system/foundation.css",
  "design-system/motion-catalog.js",
  "design-system/sound-catalog.js",
  "design-system/experience-catalog.js",
  "design-system/performance.js",
  "design-system/cinematic-fx.css",
  "design-system/cinematic-fx.js",
  "docs/U-01-DESIGN-SYSTEM.md",
  "docs/7 MB context doc.txt",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
  console.log(`✓ ${message}`);
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git") return [];
    const absolute = join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

for (const file of required) assert(statSync(join(root, file)).isFile(), `${file} exists`);

for (const file of ["script.js", "design-system/motion-catalog.js", "design-system/sound-catalog.js", "design-system/experience-catalog.js", "design-system/performance.js", "design-system/cinematic-fx.js", "scripts/apply-u01.mjs"]) {
  execFileSync(process.execPath, ["--check", join(root, file)], { stdio: "pipe" });
  console.log(`✓ ${file} parses`);
}

const html = readFileSync(join(root, "index.html"), "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert(new Set(ids).size === ids.length, "HTML IDs are unique");
for (const href of [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1])) {
  assert(ids.includes(href), `anchor #${href} resolves`);
}

for (const file of ["styles.css", "design-system/tokens.css", "design-system/foundation.css", "design-system/cinematic-fx.css"]) {
  const css = readFileSync(join(root, file), "utf8");
  assert(css.split("{").length === css.split("}").length, `${file} braces balance`);
}

// Browser catalogs are intentionally globals. A minimal window mock is enough to
// initialize and verify their cardinality without creating an AudioContext.
globalThis.window = globalThis;
globalThis.matchMedia = () => ({ matches: false });
await import(pathToFileURL(join(root, "design-system/motion-catalog.js")));
await import(pathToFileURL(join(root, "design-system/sound-catalog.js")));
await import(pathToFileURL(join(root, "design-system/experience-catalog.js")));
assert(globalThis.DrufiyMotion.size === 1200, "motion catalog exposes 1,200 recipes");
assert(globalThis.DrufiySound.size === 512, "sound catalog exposes 512 recipes");
assert(globalThis.DrufiySound.setVolume(0.91) === 0.91 && globalThis.DrufiySound.getVolume() === 0.91, "sound catalog exposes persistent master-volume control");
assert(globalThis.DrufiyExperience.size === 1024, "experience catalog exposes 1,024 executable ideas");
const idea = globalThis.DrufiyExperience.get("correlate:terminal:precise");
assert(Boolean(idea?.rationale && idea?.motion && idea?.sound), "experience recipes carry rationale, motion, and sound semantics");
assert(typeof idea?.execute === "function", "experience recipes expose executable behavior");
assert(Boolean(globalThis.DrufiyMotion.get(idea.motion)), "experience recipe resolves to a valid motion recipe");
assert(Boolean(globalThis.DrufiySound.get(idea.sound)), "experience recipe resolves to a valid sound recipe");

const contextSize = statSync(join(root, "docs/7 MB context doc.txt")).size;
assert(contextSize === 7 * 1024 * 1024, "context handoff is exactly 7 MiB");

const files = walk(root);
const forbiddenMedia = new Set([".mp3", ".wav", ".ogg", ".mp4", ".webm", ".mov", ".png", ".jpg", ".jpeg", ".webp"]);
const localMedia = files.filter((file) => forbiddenMedia.has(extname(file).toLowerCase()));
assert(localMedia.length === 0, "no local image, video, or audio payloads are stored");

const workspaceBytes = files.reduce((total, file) => total + statSync(file).size, 0);
assert(workspaceBytes < 120 * 1024 * 1024, `workspace is under 120 MiB (${(workspaceBytes / 1024 / 1024).toFixed(2)} MiB)`);

console.log("\nU-01 verification complete.");
