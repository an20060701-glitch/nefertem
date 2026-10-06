// Render wash.html to the cover backgrounds. Run from the repo root:
//   PW=$(npm root -g)/playwright node scripts/watercolor/render.mjs
// Needs Playwright with Chromium and Pillow-free `cwebp`-less flow: Chromium screenshots PNG,
// then sharp (bundled with Next) converts to WebP.
import { createRequire } from "module";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW ?? "playwright");
const sharp = require("sharp");

const here = path.dirname(new URL(import.meta.url).pathname);
const out = path.resolve(here, "../../public/images");
const sizes = { landscape: [2400, 1500], portrait: [1200, 2600] };
const seed = process.env.SEED ?? "7";

const browser = await chromium.launch();
for (const [name, [w, h]] of Object.entries(sizes)) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`file://${here}/wash.html?w=${w}&h=${h}&seed=${seed}`);
  await page.waitForTimeout(500);
  const png = await page.screenshot({ type: "png" });
  const file = path.join(out, `cover-wash-${name}.webp`);
  await sharp(png).webp({ quality: 82 }).toFile(file);
  console.log(file);
  await page.close();
}
await browser.close();
