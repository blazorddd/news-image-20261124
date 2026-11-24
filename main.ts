// news-image-20261124 entry: check the image beside this file, then copy
// its exact bytes to /output/entry.png (or MAKEFUN_OUTPUT_DIR outside the
// grader). Node 22, standard library only, no network, no wall clock.
//
// The image sums up the world's news of Tuesday, 24 November 2026:
// Nvidia reinstates Jensen Huang, Ukraine sinks a Russian warship off
// Libya, COP31 ends with no deal, plus the day's Gulf, Iowa and Mexico
// stories. It was drawn for this entry from the day's reporting.
import { copyFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MAX_BYTES = 1048576;
const MAX_DIM = 1024;

const source = new URL("./entry.png", import.meta.url);
const bytes = readFileSync(source);

if (bytes.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB cap`);
}
if (bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4e || bytes[3] !== 0x47) {
  throw new Error("entry.png is not a PNG file");
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > MAX_DIM || height > MAX_DIM) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 cap`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");
copyFileSync(source, target);

// Read the copy back and confirm it is byte for byte the image we checked.
const written = readFileSync(target);
if (!written.equals(bytes)) {
  throw new Error("the copied entry.png does not match the checked image");
}
console.log(`wrote ${target} (${bytes.length} bytes, ${width}x${height})`);
