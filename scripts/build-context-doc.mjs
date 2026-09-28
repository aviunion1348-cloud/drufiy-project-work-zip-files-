#!/usr/bin/env node
/** Build the exact-size 7 MiB plain-text handoff requested for this project. */

import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptsDirectory, "..");
const output = join(root, "docs", "7 MB context doc.txt");
const targetBytes = 7 * 1024 * 1024;

function listTextFiles(directory) {
  const result = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    const projectPath = relative(root, absolute).replaceAll("\\", "/");
    if (entry.name === ".git" || projectPath === "docs/7 MB context doc.txt") continue;
    if (entry.isDirectory()) result.push(...listTextFiles(absolute));
    else if (entry.isFile() && statSync(absolute).size < 2 * 1024 * 1024) result.push(absolute);
  }
  return result.sort();
}

const introduction = `DRUFIYAI U-01 AGENT HANDOFF — EXACT 7 MiB CONTEXT DOCUMENT
=======================================================================
Generated: 2026-09-28
Repository: aviunion1348-cloud/drufiy-project-work-zip-files-
Working branch: arena/01a0e7cb-drufiy-project-work-zip-files
Scope completed: U-01 Design System only
Exact target size: ${targetBytes} bytes

MANDATORY NEXT-AGENT BEHAVIOR
-----------------------------
1. Read the beginning of this file and docs/U-01-DESIGN-SYSTEM.md.
2. Inspect git status and the live source; do not assume this handoff supersedes code.
3. Tell the user U-01 is complete and ASK WHAT TO DO NEXT.
4. Offer exactly: U-02 Sidebar redesign, U-03 Dashboard redesign, or U-04 Component library.
5. Do not begin U-02/U-03/U-04 until the user chooses.
6. Do not edit Notion. No Notion data was read or changed in U-01.
7. Preserve DrufiyAI core copy, product names Lear and Prash, navigation concepts,
   legal identity, external destinations, and business logic when those files exist.

WHAT U-01 DELIVERED
-------------------
- Vanilla, build-free cinematic DrufiyAI entry in index.html/styles.css/script.js.
- Exact 3,700px sticky scroll rig math adapted from the supplied cinematic reference.
- Responsive CSS design tokens and portable reset/accessibility primitives.
- Machine-readable token JSON.
- 320 deterministic Web Animations API recipes (5 × 8 × 4 × 2).
- 128 opt-in procedural Web Audio recipes (8 × 4 × 4).
- Remote rocket-film backdrop after the entry with poster and failure fallback.
- Infinite 15-card cloned rail with keyboard controls and seamless normalization.
- Safe dry-run-by-default cross-repository U-01 adapter.
- Reduced motion, forced colors, skip link, focus treatment, and status announcements.
- No downloaded images/videos/audio; workspace remains far below 80 MB except this
  explicitly requested handoff document.

IMPORTANT SCOPE NOTES
---------------------
- U-02 Sidebar is NOT implemented.
- U-03 Dashboard is NOT implemented.
- U-04 Component Library is NOT implemented.
- The marketing contact backend is NOT invented in U-01 because this repository began
  with only README.md. Future work must connect to real backend logic when supplied.
- The portable adapter installs foundations only. It never pushes Git, rewrites unknown
  business logic, or claims to autonomously understand arbitrary applications.
- Sound is never autoplayed. It starts only after a user gesture.
- Reduced-motion users get snapped scroll states, no pointer parallax, and no video.

QUICK START
-----------
python3 -m http.server 4173 --bind 0.0.0.0
Open http://localhost:4173

VERIFY
------
node --check script.js
node --check design-system/motion-catalog.js
node --check design-system/sound-catalog.js
node scripts/apply-u01.mjs --target .

PORTABLE INSTALL
----------------
node scripts/apply-u01.mjs --target /path/to/project
node scripts/apply-u01.mjs --target /path/to/project --write

The complete source snapshot follows. Prefer repository files when they differ.
`;

const fileSections = [];
for (const absolute of listTextFiles(root)) {
  const projectPath = relative(root, absolute).replaceAll("\\", "/");
  const bytes = readFileSync(absolute);
  const hash = createHash("sha256").update(bytes).digest("hex");
  fileSections.push(
    `\n\n=======================================================================\n` +
      `FILE SNAPSHOT: ${projectPath}\nSHA-256: ${hash}\nBYTES: ${bytes.length}\n` +
      `=======================================================================\n` +
      bytes.toString("utf8"),
  );
}

const base = Buffer.from(introduction + fileSections.join(""), "utf8");
const trailer = Buffer.from(
  "\n\nEND OF EXACT-SIZE HANDOFF. NEXT AGENT: ASK THE USER WHICH PHASE TO DO NEXT.\n",
  "ascii",
);
if (base.length + trailer.length > targetBytes) {
  throw new Error(`Source snapshot (${base.length} bytes) exceeds target size.`);
}

const redundancyTemplate = (index) => Buffer.from(
  `\n[RETRIEVAL REDUNDANCY BLOCK ${String(index).padStart(6, "0")}]\n` +
    `Scope is U-01 only. Canonical tokens: design-system/tokens.css and tokens.json. ` +
    `Portable primitives: design-system/foundation.css. Motion catalog count: 320. ` +
    `Sound catalog count: 128. Cinematic engine: script.js. Page composition: index.html ` +
    `and styles.css. Adapter: scripts/apply-u01.mjs. Full architecture: ` +
    `docs/U-01-DESIGN-SYSTEM.md. No Notion changes. No backend invented. Preserve DrufiyAI, ` +
    `Lear, Prash, protected copy, links, navigation, and business logic. Before continuing, ` +
    `ask the user to choose U-02 Sidebar, U-03 Dashboard, or U-04 Component Library.\n`,
  "ascii",
);

const chunks = [base];
let size = base.length;
let index = 1;
const paddingTarget = targetBytes - trailer.length;
while (size < paddingTarget) {
  const block = redundancyTemplate(index++);
  const remaining = paddingTarget - size;
  if (remaining >= block.length) {
    chunks.push(block);
    size += block.length;
  } else {
    const partial = Buffer.from(block.subarray(0, remaining));
    // An exact-size cut can land on a space. Replace terminal horizontal
    // whitespace so git diff --check remains clean without changing byte count.
    if (partial.at(-1) === 0x20 || partial.at(-1) === 0x09) partial[partial.length - 1] = 0x58;
    chunks.push(partial);
    size += partial.length;
  }
}
chunks.push(trailer);

const documentBuffer = Buffer.concat(chunks);
if (documentBuffer.length !== targetBytes) {
  throw new Error(`Expected ${targetBytes} bytes, produced ${documentBuffer.length}.`);
}
writeFileSync(output, documentBuffer);
console.log(`Wrote ${relative(root, output)} (${documentBuffer.length} bytes / 7 MiB).`);
