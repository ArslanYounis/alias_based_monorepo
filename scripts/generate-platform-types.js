#!/usr/bin/env node
/**
 * Generates shared/__platform_types__/*.d.ts from components that exist
 * in BOTH web/src/ui and mobile/src/ui. No manual type definitions needed.
 *
 * Run from repo root: node scripts/generate-platform-types.js
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const WEB_UI = path.join(REPO_ROOT, "web", "src", "ui");
const MOBILE_UI = path.join(REPO_ROOT, "mobile", "src", "ui");
const OUT_DIR = path.join(REPO_ROOT, "shared", "__platform_types__");

function listUiComponents(dir) {
  if (!fs.existsSync(dir)) return new Set();
  return new Set(
    fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith(".tsx"))
      .map((e) => e.name.replace(/\.tsx$/, "")),
  );
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
