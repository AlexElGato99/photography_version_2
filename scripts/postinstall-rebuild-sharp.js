/**
 * Rebuild sharp for the current OS/CPU. Required when node_modules was
 * installed on another platform (e.g. Windows vs WSL) or after a partial install.
 * Does not fail the whole `npm install` if rebuild fails (run `npm rebuild sharp` manually).
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const sharpPkg = path.join(root, "node_modules", "sharp", "package.json");

if (!fs.existsSync(sharpPkg)) {
  process.exit(0);
}

if (process.env.SKIP_SHARP_REBUILD === "1") {
  console.log("[postinstall] SKIP_SHARP_REBUILD=1, skipping sharp rebuild.");
  process.exit(0);
}

try {
  execSync("npm rebuild sharp", { cwd: root, stdio: "inherit" });
} catch {
  console.warn(
    "\n[postinstall] sharp rebuild failed. Image uploads may break until you run:\n" +
      "  npm rebuild sharp\n" +
      "If you use WSL on /mnt/d, run installs and rebuild from the same environment.\n"
  );
  process.exit(0);
}
