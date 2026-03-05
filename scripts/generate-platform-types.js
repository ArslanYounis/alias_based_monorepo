#!/usr/bin/env node
/**
 * Generates shared/__platform_types__/*.d.ts from components that exist
 * in BOTH web/src/ui and mobile/src/ui. Supports folder-based structure:
 * each component lives in a folder (e.g. AddButton/AddButton.tsx or AddButton/index.ts).
 *
 * Run from repo root: node scripts/generate-platform-types.js
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const WEB_UI = path.join(REPO_ROOT, "web", "src", "ui");
const MOBILE_UI = path.join(REPO_ROOT, "mobile", "src", "ui");
const OUT_DIR = path.join(REPO_ROOT, "shared", "__platform_types__");

/**
 * List component names from a platform UI directory.
 * Supports both flat (.tsx files) and folder-based (subdirs with ComponentName.tsx or index.ts).
 */
function listUiComponents(dir) {
  if (!fs.existsSync(dir)) return new Set();
  const names = new Set();
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    if (e.name === "configs") continue; // skip configs folder in web

    if (e.isFile() && e.name.endsWith(".tsx")) {
      names.add(e.name.replace(/\.tsx$/, ""));
      continue;
    }

    if (e.isDirectory()) {
      const dirPath = path.join(dir, e.name);
      const hasComponentTsx = fs.existsSync(
        path.join(dirPath, `${e.name}.tsx`)
      );
      const hasIndex =
        fs.existsSync(path.join(dirPath, "index.ts")) ||
        fs.existsSync(path.join(dirPath, "index.tsx"));
      if (hasComponentTsx || hasIndex) {
        names.add(e.name);
      }
    }
  }

  return names;
}

function pascalToPropsName(name) {
  return name + "Props";
}

/**
 * Parse named exports from a .tsx/.ts file.
 * Looks for patterns like: export const Foo, export function Foo, export { Foo }
 */
function parseNamedExports(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf8");
  const exports = new Set();

  // Match: export const/let/var/function/class Name
  const declRegex = /export\s+(?:const|let|var|function|class)\s+([A-Z]\w*)/g;
  let match;
  while ((match = declRegex.exec(content)) !== null) {
    exports.add(match[1]);
  }

  return [...exports];
}

/**
 * Get the entry file for a component folder (index.tsx/ts or ComponentName.tsx).
 */
function getEntryFile(platformDir, componentName) {
  const dir = path.join(platformDir, componentName);
  for (const candidate of [
    path.join(dir, "index.tsx"),
    path.join(dir, "index.ts"),
    path.join(dir, `${componentName}.tsx`),
  ]) {
    if (fs.existsSync(candidate)) return candidate;
  }
  // flat file
  const flat = path.join(platformDir, `${componentName}.tsx`);
  if (fs.existsSync(flat)) return flat;
  return null;
}

/**
 * Check if a module exports multiple named components (not matching folder name).
 * Returns the list of named exports if multi-export, otherwise null.
 */
function getMultiExports(componentName) {
  const webEntry = getEntryFile(WEB_UI, componentName);
  const mobileEntry = getEntryFile(MOBILE_UI, componentName);
  if (!webEntry || !mobileEntry) return null;

  const webExports = parseNamedExports(webEntry);
  const mobileExports = parseNamedExports(mobileEntry);

  // If the module exports the folder name itself, use the standard single-export stub
  if (webExports.includes(componentName)) return null;

  // Find common named exports across both platforms
  const mobileSet = new Set(mobileExports);
  const common = webExports.filter((e) => mobileSet.has(e));

  if (common.length > 0) return common;
  return null;
}

function generateStub(componentName) {
  const multiExports = getMultiExports(componentName);

  if (multiExports) {
    // Multi-export module: generate a stub for each named export
    const webImports = multiExports
      .map((e) => `  ${e} as Web${e}`)
      .join(",\n");
    const mobileImports = multiExports
      .map((e) => `  ${e} as Mobile${e}`)
      .join(",\n");
    const typeAndExport = multiExports
      .map((e) => {
        const propsName = pascalToPropsName(e);
        return `export type ${propsName} =
  | ComponentProps<typeof Web${e}>
  | ComponentProps<typeof Mobile${e}>;
export const ${e}: FC<${propsName}>;`;
      })
      .join("\n\n");

    return `import type { ComponentProps, FC } from "react";
import type {
${webImports}
} from "../../web/src/ui/${componentName}";
import type {
${mobileImports}
} from "../../mobile/src/ui/${componentName}";

${typeAndExport}
`;
  }

  // Standard single-export module
  const propsName = pascalToPropsName(componentName);
  return `import type { ComponentProps, FC } from "react";
import type { ${componentName} as Web${componentName} } from "../../web/src/ui/${componentName}";
import type { ${componentName} as Mobile${componentName} } from "../../mobile/src/ui/${componentName}";

export type ${propsName} =
  | ComponentProps<typeof Web${componentName}>
  | ComponentProps<typeof Mobile${componentName}>;
export const ${componentName}: FC<${propsName}>;
`;
}

const webNames = listUiComponents(WEB_UI);
const mobileNames = listUiComponents(MOBILE_UI);
const common = [...webNames].filter((n) => mobileNames.has(n));

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

let created = 0;
let updated = 0;
for (const name of common) {
  const outPath = path.join(OUT_DIR, `${name}.d.ts`);
  const content = generateStub(name);
  const existed = fs.existsSync(outPath);
  fs.writeFileSync(outPath, content, "utf8");
  if (existed) updated++;
  else created++;
}

console.log(
  `Platform types: ${created} created, ${updated} updated (${common.length} total in both web & mobile).`,
);
