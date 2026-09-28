#!/usr/bin/env node
/** Build a self-contained downloadable ZIP without embedding remote media payloads. */

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const releaseDirectory = join(root, "releases");
const archiveName = "drufiyai-ultra-immersive.zip";
const archivePath = join(releaseDirectory, archiveName);
const bundleName = "drufiyai-ultra-immersive";
const temporaryRoot = mkdtempSync(join(tmpdir(), "drufiyai-release-"));
const stagedRoot = join(temporaryRoot, bundleName);
const excluded = new Set([".git", "node_modules", "releases", ".DS_Store"]);

mkdirSync(releaseDirectory, { recursive: true });
rmSync(archivePath, { force: true });

cpSync(root, stagedRoot, {
  recursive: true,
  filter(source) {
    if (source === root) return true;
    return !excluded.has(basename(source));
  },
});

let commit = "uncommitted";
try {
  commit = execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
} catch {}

const manifest = {
  name: "DrufiyAI Ultra Immersive Experience",
  version: "2.0.0",
  generated: new Date().toISOString(),
  commit,
  requirements: "Node.js 18 or newer",
  start: "npm install && npm run dev",
  test: "npm test",
  routes: ["/", "/lear.html", "/prash.html", "/method.html", "/principles.html", "/signal-map.html"],
  note: "Images, films, and the Ogg font are loaded from documented remote URLs; no large media binaries are embedded.",
};
writeFileSync(join(stagedRoot, "RELEASE-MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);

try {
  execFileSync("zip", ["-r", "-9", archivePath, bundleName], { cwd: temporaryRoot, stdio: "inherit" });
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}

const archive = readFileSync(archivePath);
const hash = createHash("sha256").update(archive).digest("hex");
writeFileSync(join(releaseDirectory, "SHA256SUMS.txt"), `${hash}  ${archiveName}\n`);
console.log(`\nRelease: ${archivePath}`);
console.log(`Size: ${(archive.length / 1024 / 1024).toFixed(2)} MiB`);
console.log(`SHA-256: ${hash}`);
