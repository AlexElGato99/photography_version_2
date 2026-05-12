/**
 * Removes Next.js output and tooling caches. Fixes "Cannot find module './NNNN.js'"
 * when .next is stale (interrupted dev, switching WSL ↔ Windows on the same folder).
 *
 * On WSL + /mnt/d/..., Node's fs.rmSync often hits ENOTEMPTY; we retry and fall back
 * to `rm -rf` (Unix/WSL) or `rmdir /s /q` (Windows).
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { setTimeout: delay } = require("timers/promises");

const root = path.join(__dirname, "..");

function tryShellRemove(abs) {
  const wsl = !!process.env.WSL_DISTRO_NAME;
  const treatAsUnix = process.platform !== "win32" || wsl;

  if (treatAsUnix) {
    try {
      execFileSync("rm", ["-rf", abs], { stdio: "inherit" });
      return !fs.existsSync(abs);
    } catch {
      return false;
    }
  }

  try {
    execFileSync("cmd.exe", ["/c", "rmdir", "/s", "/q", abs], { stdio: "inherit" });
    return !fs.existsSync(abs);
  } catch {
    return false;
  }
}

async function rmDir(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    console.log("Skip (missing):", rel);
    return;
  }

  const retryCodes = new Set([
    "ENOTEMPTY",
    "EBUSY",
    "EPERM",
    "EACCES",
    "EMFILE",
  ]);

  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      fs.rmSync(abs, { recursive: true, force: true });
      console.log("Removed", rel);
      return;
    } catch (e) {
      if (e && e.code === "ENOENT") return;
      const shouldRetry = e && retryCodes.has(e.code);
      const isLast = attempt === 11;

      if (isLast || !shouldRetry) {
        if (tryShellRemove(abs)) {
          console.log("Removed", rel, "(shell fallback)");
          return;
        }
        if (isLast) throw e;
      }
      if (!isLast) await delay(120 + attempt * 80);
    }
  }
}

(async () => {
  await rmDir(".next");
  await rmDir("node_modules/.cache");
  console.log("Clean finished. Run: npm run dev");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
