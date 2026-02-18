#!/usr/bin/env node

/**
 * Build script for @adrec/mobile-ui component library
 *
 * This script:
 * 1. Cleans the dist directory
 * 2. Compiles TypeScript with declarations
 * 3. Resolves path aliases to relative imports
 * 4. Reorganizes output for proper package structure
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

// Helper to run commands
function run(cmd, options = {}) {
  console.log(`\n> ${cmd}\n`);
  execSync(cmd, { stdio: "inherit", cwd: ROOT, ...options });
}

// Helper to recursively copy directory
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Warning: Source directory ${src} does not exist`);
    return;
  }

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper to recursively move directory
function moveDir(src, dest) {
  if (!fs.existsSync(src)) return;
  copyDir(src, dest);
  fs.rmSync(src, { recursive: true, force: true });
}

// Helper to recursively process files
function processFiles(dir, processor) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processFiles(fullPath, processor);
    } else if (entry.name.endsWith(".js") || entry.name.endsWith(".d.ts")) {
      processor(fullPath);
    }
  }
}

// Fix path aliases in compiled files
function fixAliases(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  const fileDir = path.dirname(filePath);

  // Replace @platform/* with relative path to src/ui
  content = content.replace(
    /from\s+["']@platform\/([^"']+)["']/g,
    (match, modulePath) => {
      const targetPath = path.join("src", "ui", modulePath);
      let relativePath = path.relative(fileDir, path.join(DIST, targetPath));
      if (!relativePath.startsWith(".")) {
        relativePath = "./" + relativePath;
      }
      // Remove .js extension if present for cleaner imports
      return `from "${relativePath}"`;
    }
  );

  // Replace @shared/* with relative path to shared
  content = content.replace(
    /from\s+["']@shared\/([^"']+)["']/g,
    (match, modulePath) => {
      const targetPath = path.join("shared", modulePath);
      let relativePath = path.relative(fileDir, path.join(DIST, targetPath));
      if (!relativePath.startsWith(".")) {
        relativePath = "./" + relativePath;
      }
      return `from "${relativePath}"`;
    }
  );

  // Replace ~/* with relative path
  content = content.replace(
    /from\s+["']~\/([^"']+)["']/g,
    (match, modulePath) => {
      let relativePath = path.relative(fileDir, path.join(DIST, modulePath));
      if (!relativePath.startsWith(".")) {
        relativePath = "./" + relativePath;
      }
      return `from "${relativePath}"`;
    }
  );

  // Also fix require statements
  content = content.replace(
    /require\(["']@platform\/([^"']+)["']\)/g,
    (match, modulePath) => {
      const targetPath = path.join("src", "ui", modulePath);
      let relativePath = path.relative(fileDir, path.join(DIST, targetPath));
      if (!relativePath.startsWith(".")) {
        relativePath = "./" + relativePath;
      }
      return `require("${relativePath}")`;
    }
  );

  content = content.replace(
    /require\(["']@shared\/([^"']+)["']\)/g,
    (match, modulePath) => {
      const targetPath = path.join("shared", modulePath);
      let relativePath = path.relative(fileDir, path.join(DIST, targetPath));
      if (!relativePath.startsWith(".")) {
        relativePath = "./" + relativePath;
      }
      return `require("${relativePath}")`;
    }
  );

  fs.writeFileSync(filePath, content);
}

async function build() {
  console.log("🏗️  Building @adrec/mobile-ui library...\n");

  // Step 1: Clean dist directory
  console.log("📁 Cleaning dist directory...");
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
  }

  // Step 2: Compile TypeScript
  console.log("📝 Compiling TypeScript...");
  try {
    run("npx tsc -p tsconfig.build.json");
  } catch (error) {
    console.error("TypeScript compilation failed");
    process.exit(1);
  }

  // Step 3: Reorganize output structure
  // Due to rootDir being "..", output is in dist/mobile/ and dist/shared/
  // We need to flatten this to dist/
  console.log("📦 Reorganizing output structure...");

  const mobileOut = path.join(DIST, "mobile");
  const sharedOut = path.join(DIST, "shared");

  // Move mobile contents to dist root
  if (fs.existsSync(mobileOut)) {
    const entries = fs.readdirSync(mobileOut);
    for (const entry of entries) {
      const src = path.join(mobileOut, entry);
      const dest = path.join(DIST, entry);
      if (fs.statSync(src).isDirectory()) {
        moveDir(src, dest);
      } else {
        fs.renameSync(src, dest);
      }
    }
    fs.rmSync(mobileOut, { recursive: true, force: true });
  }

  // Keep shared at dist/shared/ (already in correct place)

  // Step 4: Fix path aliases in output files
  console.log("🔧 Resolving path aliases...");
  processFiles(DIST, fixAliases);

  // Step 5: Clean up source shared/components - remove generated .js, .map, .d.ts files
  console.log(
    "🧹 Cleaning source shared/components (removing generated files)..."
  );
  const sourceSharedDir = path.resolve(ROOT, "..", "shared", "components");
  if (fs.existsSync(sourceSharedDir)) {
    const cleanupSourceFiles = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          cleanupSourceFiles(fullPath);
        } else if (
          entry.name.endsWith(".js") ||
          entry.name.endsWith(".js.map") ||
          entry.name.endsWith(".d.ts") ||
          entry.name.endsWith(".d.ts.map")
        ) {
          fs.unlinkSync(fullPath);
        }
      }
    };
    cleanupSourceFiles(sourceSharedDir);
  }

  // Step 5b: Clean up source shared/types - remove generated .js, .map, .d.ts files
  console.log("🧹 Cleaning source shared/types (removing generated files)...");
  const sourceSharedTypesDir = path.resolve(ROOT, "..", "shared", "types");
  if (fs.existsSync(sourceSharedTypesDir)) {
    const cleanupSourceFiles = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          cleanupSourceFiles(fullPath);
        } else if (
          entry.name.endsWith(".js") ||
          entry.name.endsWith(".js.map") ||
          entry.name.endsWith(".d.ts") ||
          entry.name.endsWith(".d.ts.map")
        ) {
          fs.unlinkSync(fullPath);
        }
      }
    };
    cleanupSourceFiles(sourceSharedTypesDir);
  }

  // Step 6: Copy assets that might be needed
  console.log("📋 Copying additional assets...");

  // Copy global.css if it exists
  const globalCss = path.join(ROOT, "global.css");
  if (fs.existsSync(globalCss)) {
    fs.copyFileSync(globalCss, path.join(DIST, "global.css"));
  }

  console.log("\n✅ Build complete! Output in dist/\n");

  // Print what was built
  console.log("📊 Build summary:");
  const files = [];
  processFiles(DIST, (f) => files.push(path.relative(DIST, f)));
  console.log(
    `   - ${files.filter((f) => f.endsWith(".js")).length} JavaScript files`
  );
  console.log(
    `   - ${
      files.filter((f) => f.endsWith(".d.ts")).length
    } TypeScript declaration files`
  );
  console.log(
    `   - ${files.filter((f) => f.endsWith(".map")).length} Source map files`
  );

  // Verify main entry point exists
  const mainEntry = path.join(DIST, "lib-index.js");
  if (fs.existsSync(mainEntry)) {
    console.log(`\n✨ Main entry point: dist/lib-index.js`);
  } else {
    console.warn(
      "\n⚠️  Warning: Main entry point not found at dist/lib-index.js"
    );
  }
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
