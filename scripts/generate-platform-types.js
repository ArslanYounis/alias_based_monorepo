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

function generateStub(componentName) {
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
