#!/usr/bin/env node
/**
 * DrufiyAI U-01 portable foundation adapter.
 *
 * Safe by default: performs a dry run unless --write is supplied.
 * Usage: node scripts/apply-u01.mjs --target /path/to/project --write
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const sourceRoot = resolve(scriptDirectory, "..");
const argumentsList = process.argv.slice(2);
const writeMode = argumentsList.includes("--write");
const targetFlagIndex = argumentsList.indexOf("--target");
const targetRoot = resolve(targetFlagIndex >= 0 ? argumentsList[targetFlagIndex + 1] : process.cwd());
const marker = "/* drufiy-u01:precision-foundation */";

function fail(message) {
  console.error(`[U-01] ${message}`);
  process.exitCode = 1;
}

function toCssPath(pathValue) {
  const normalized = pathValue.split(sep).join("/");
  return normalized.startsWith(".") ? normalized : `./${normalized}`;
}

function detectStack() {
  const packagePath = join(targetRoot, "package.json");
  if (!existsSync(packagePath)) return { name: "vanilla", packagePath: null };

  try {
    const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    if (dependencies.next) return { name: "next", packagePath };
    if (dependencies["@remix-run/react"]) return { name: "remix", packagePath };
    if (dependencies.astro) return { name: "astro", packagePath };
    if (dependencies.vue) return { name: "vue", packagePath };
    if (dependencies.svelte) return { name: "svelte", packagePath };
    if (dependencies.vite) return { name: "vite", packagePath };
    if (dependencies.react) return { name: "react", packagePath };
    return { name: "node", packagePath };
  } catch {
    return { name: "unknown", packagePath };
  }
}

function findStyleEntry() {
  const candidates = [
    "src/app/globals.css",
    "app/globals.css",
    "src/styles/globals.css",
    "src/index.css",
    "src/main.css",
    "styles/globals.css",
    "styles.css",
    "style.css",
  ];
  return candidates.map((candidate) => join(targetRoot, candidate)).find(existsSync) ?? null;
}

function findHtmlEntry() {
  return ["index.html", "public/index.html"]
    .map((candidate) => join(targetRoot, candidate))
    .find(existsSync) ?? null;
}

function copyFoundation(destinationDirectory) {
  mkdirSync(destinationDirectory, { recursive: true });
  for (const fileName of ["tokens.css", "foundation.css", "motion-catalog.js", "sound-catalog.js"]) {
    copyFileSync(join(sourceRoot, "design-system", fileName), join(destinationDirectory, fileName));
  }
}

if (!existsSync(targetRoot)) {
  fail(`Target does not exist: ${targetRoot}`);
} else {
  const stack = detectStack();
  const styleEntry = findStyleEntry();
  const htmlEntry = findHtmlEntry();
  const destinationDirectory = join(targetRoot, ".drufiy", "design-system");

  console.log(`[U-01] target: ${targetRoot}`);
  console.log(`[U-01] detected stack: ${stack.name}`);
  console.log(`[U-01] style entry: ${styleEntry ? relative(targetRoot, styleEntry) : "not found"}`);
  console.log(`[U-01] html entry: ${htmlEntry ? relative(targetRoot, htmlEntry) : "not found"}`);
  console.log(`[U-01] mode: ${writeMode ? "write" : "dry-run"}`);

  if (!styleEntry && !htmlEntry) {
    fail("No supported CSS or HTML entry was found; no files were changed.");
  } else if (writeMode) {
    copyFoundation(destinationDirectory);

    if (styleEntry) {
      const current = readFileSync(styleEntry, "utf8");
      if (!current.includes(marker)) {
        const tokenImport = toCssPath(relative(dirname(styleEntry), join(destinationDirectory, "tokens.css")));
        const foundationImport = toCssPath(relative(dirname(styleEntry), join(destinationDirectory, "foundation.css")));
        const importBlock = `${marker}\n@import url("${tokenImport}");\n@import url("${foundationImport}");\n\n`;
        writeFileSync(styleEntry, importBlock + current);
        console.log(`[U-01] imports added to ${relative(targetRoot, styleEntry)}`);
      } else {
        console.log("[U-01] CSS foundation already installed; import skipped.");
      }
    } else if (htmlEntry) {
      const bundledPath = join(targetRoot, "drufiy-u01.css");
      const bundle = ["tokens.css", "foundation.css"]
        .map((fileName) => readFileSync(join(destinationDirectory, fileName), "utf8"))
        .join("\n\n");
      writeFileSync(bundledPath, `${marker}\n${bundle}`);

      const current = readFileSync(htmlEntry, "utf8");
      if (!current.includes("drufiy-u01.css")) {
        const linked = current.replace(/<\/head>/i, '  <link rel="stylesheet" href="./drufiy-u01.css" />\n</head>');
        writeFileSync(htmlEntry, linked);
        console.log(`[U-01] stylesheet linked from ${relative(targetRoot, htmlEntry)}`);
      }
    }

    console.log("[U-01] foundation installed. Component markup is intentionally untouched.");
  } else {
    console.log("[U-01] dry run complete. Add --write to install the portable foundation.");
  }
}
