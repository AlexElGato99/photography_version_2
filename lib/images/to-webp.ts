const MAX_INPUT_BYTES = 35 * 1024 * 1024;

const SHARP_HINT =
  "Sharp failed to load. If this project lives on /mnt/d and you run Node inside WSL, " +
  "your node_modules were likely installed on Windows. From WSL run: npm rebuild sharp " +
  "(or rm -rf node_modules && npm install inside WSL).";

/**
 * Decode any raster format sharp supports (JPEG, PNG, GIF, WebP, AVIF, TIFF, …)
 * and encode as WebP. Uses first frame only for animated / multi-page inputs.
 */
export async function bufferToWebp(input: Buffer): Promise<Buffer> {
  if (!input.length) {
    throw new Error("Empty image data.");
  }
  if (input.length > MAX_INPUT_BYTES) {
    throw new Error("Image file is too large.");
  }

  let sharp: typeof import("sharp");
  try {
    const mod = await import("sharp");
    sharp =
      (mod as { default?: typeof import("sharp") }).default ??
      (mod as unknown as typeof import("sharp"));
  } catch (e) {
    const err = new Error(SHARP_HINT);
    (err as Error & { cause?: unknown }).cause = e;
    throw err;
  }

  try {
    return await sharp(input, {
      failOn: "none",
      pages: 1,
    })
      .rotate()
      .webp({ quality: 85, effort: 4 })
      .toBuffer();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (
      msg.includes("sharp") ||
      msg.includes("linux-x64") ||
      msg.includes("runtime")
    ) {
      const err = new Error(SHARP_HINT);
      (err as Error & { cause?: unknown }).cause = e;
      throw err;
    }
    throw e;
  }
}
