/**
 * One-off generator for favicon, app icons, schema logo and default OG image.
 * Source: public/logoCities/lcs.png (colour mark). Crop keeps the ball only.
 * Run: node scripts/generate-brand-assets.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "public/logoCities/lcs.png");

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };
const BG_DARK = "#0E1016";
const TEXT = "#F4F7FB";
const AQUA = "#00EDAF";
const BLUE_DEEP = "#011674";
const BLUE_PRIMARY = "#012BFD";

const ICON_MARGIN = 0.12;
const MASKABLE_MARGIN = 0.175;
const PLATE_RADIUS = 0.2;

function isInk(data, i) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
  if (a < 20) return false;
  const brightness = (r + g + b) / 3;
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  return brightness < 245 || chroma > 12;
}

function rowInkCount(data, width, y) {
  let count = 0;
  const row = y * width * 4;
  for (let x = 0; x < width; x += 1) {
    if (isInk(data, row + x * 4)) count += 1;
  }
  return count;
}

/** Ball sits above the wordmark; the largest interior empty band is the split. */
function ballExtractBox(info, data) {
  const { width, height } = info;
  const emptyThreshold = Math.max(2, Math.round(width * 0.01));
  const gaps = [];
  let gapStart = null;
  for (let y = 0; y < height; y += 1) {
    const empty = rowInkCount(data, width, y) < emptyThreshold;
    if (empty && gapStart === null) gapStart = y;
    if (!empty && gapStart !== null) {
      gaps.push({ start: gapStart, end: y - 1, size: y - gapStart });
      gapStart = null;
    }
  }
  const interior = gaps.filter((g) => g.start > 8 && g.end < height - 8);
  interior.sort((a, b) => b.size - a.size);
  const split = interior[0];
  if (!split) {
    throw new Error("Could not find the gap between the ball and the LCS wordmark.");
  }
  return { left: 0, top: 0, width, height: split.start };
}

function roundedRectSvg(size, radius, fill) {
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${fill}"/></svg>`,
  );
}

async function containOnCanvas(input, size, marginRatio, background) {
  const inner = Math.max(1, Math.round(size * (1 - 2 * marginRatio)));
  const fitted = await sharp(input)
    .resize(inner, inner, { fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();
  const meta = await sharp(fitted).metadata();
  const left = Math.round((size - (meta.width ?? inner)) / 2);
  const top = Math.round((size - (meta.height ?? inner)) / 2);
  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: fitted, left, top }])
    .png()
    .toBuffer();
}

async function uiIcon(symbol, size, { opaque = false } = {}) {
  const radius = Math.round(size * PLATE_RADIUS);
  const plate = opaque
    ? await sharp({
        create: { width: size, height: size, channels: 4, background: WHITE },
      })
        .png()
        .toBuffer()
    : await sharp(roundedRectSvg(size, radius, "#ffffff")).png().toBuffer();
  const mark = await containOnCanvas(symbol, size, ICON_MARGIN, TRANSPARENT);
  return sharp(plate).composite([{ input: mark }]).png().toBuffer();
}

function icoFromPngs(images) {
  const count = images.length;
  const headerSize = 6 + 16 * count;
  let offset = headerSize;
  const entries = images.map(({ size, png }) => {
    const entry = { size, offset, bytes: png.length };
    offset += png.length;
    return entry;
  });
  const buf = Buffer.alloc(offset);
  buf.writeUInt16LE(0, 0);
  buf.writeUInt16LE(1, 2);
  buf.writeUInt16LE(count, 4);
  let cursor = 6;
  for (const entry of entries) {
    buf.writeUInt8(entry.size >= 256 ? 0 : entry.size, cursor);
    buf.writeUInt8(entry.size >= 256 ? 0 : entry.size, cursor + 1);
    buf.writeUInt8(0, cursor + 2);
    buf.writeUInt8(0, cursor + 3);
    buf.writeUInt16LE(1, cursor + 4);
    buf.writeUInt16LE(32, cursor + 6);
    buf.writeUInt32LE(entry.bytes, cursor + 8);
    buf.writeUInt32LE(entry.offset, cursor + 12);
    cursor += 16;
  }
  let payloadAt = headerSize;
  for (const { png } of images) {
    png.copy(buf, payloadAt);
    payloadAt += png.length;
  }
  return buf;
}

async function writePng(path, buffer) {
  await mkdir(dirname(path), { recursive: true });
  const png = await sharp(buffer).png().toBuffer();
  await writeFile(path, png);
  const meta = await sharp(png).metadata();
  console.log(`wrote ${path} (${meta.width}×${meta.height}, ${png.length} bytes)`);
}

async function buildOg(symbol) {
  const width = 1200;
  const height = 630;
  const plateSize = 268;
  const backdrop = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${BLUE_DEEP}"/>
      <stop offset="50%" stop-color="${BLUE_PRIMARY}"/>
      <stop offset="100%" stop-color="${AQUA}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="${BG_DARK}"/>
  <rect width="${width}" height="8" fill="url(#g)"/>
  <text x="600" y="456" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="8" fill="${AQUA}">LCS</text>
  <text x="600" y="518" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="700" fill="${TEXT}">Lega Calcio Studenti</text>
</svg>`);
  const plate = await uiIcon(symbol, plateSize, { opaque: false });
  const left = Math.round((width - plateSize) / 2);
  const top = 96;
  return sharp(backdrop)
    .composite([{ input: plate, left, top }])
    .png()
    .toBuffer();
}

async function main() {
  const source = await readFile(SOURCE);
  const raw = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const box = ballExtractBox(raw.info, raw.data);
  console.log(`ball crop: ${box.width}×${box.height} at y=0..${box.height - 1}`);

  const cropped = await sharp(source).extract(box).png().toBuffer();
  const symbol = await sharp(cropped).trim({ threshold: 8 }).png().toBuffer();
  const symbolMeta = await sharp(symbol).metadata();
  console.log(`trimmed symbol: ${symbolMeta.width}×${symbolMeta.height}`);

  const appDir = join(ROOT, "src/app");
  const brandDir = join(ROOT, "public/brand");
  await mkdir(brandDir, { recursive: true });

  const icon512 = await uiIcon(symbol, 512);
  const icon192 = await uiIcon(symbol, 192);
  const apple = await uiIcon(symbol, 180, { opaque: true });
  const logo512 = await containOnCanvas(symbol, 512, ICON_MARGIN, TRANSPARENT);
  const maskable192 = await containOnCanvas(symbol, 192, MASKABLE_MARGIN, WHITE);
  const maskable512 = await containOnCanvas(symbol, 512, MASKABLE_MARGIN, WHITE);
  const og = await buildOg(symbol);

  const faviconSizes = [16, 32, 48];
  const faviconPngs = [];
  for (const size of faviconSizes) {
    faviconPngs.push({ size, png: await uiIcon(symbol, size) });
  }

  await writePng(join(appDir, "icon.png"), icon512);
  await writePng(join(appDir, "icon1.png"), icon192);
  await writePng(join(appDir, "apple-icon.png"), apple);
  await writePng(join(brandDir, "logo-lcs-512.png"), logo512);
  await writePng(join(brandDir, "icon-maskable-192.png"), maskable192);
  await writePng(join(brandDir, "icon-maskable-512.png"), maskable512);
  await writePng(join(brandDir, "og-default.png"), og);

  const ico = icoFromPngs(faviconPngs);
  const faviconPath = join(appDir, "favicon.ico");
  await writeFile(faviconPath, ico);
  console.log(`wrote ${faviconPath} (${ico.length} bytes, sizes ${faviconSizes.join("/")})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
