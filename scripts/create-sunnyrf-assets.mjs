import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
// Input: genuine Orca captures and capture metadata; never reconstructed site UI.
const source = process.argv[2];
if (!source)
  throw new Error(
    "Usage: node scripts/create-sunnyrf-assets.mjs <capture-directory>",
  );
const out = "public/images/work/sunnyrf";
await fs.mkdir(`${out}/screens`, { recursive: true });
const selected = [
  "desktop-product",
  "desktop-handpiece",
  "desktop-technology",
  "mobile-product",
  "mobile-handpiece-final",
  "mobile-mode-final",
];
for (const name of selected) {
  const meta = JSON.parse(
    await fs.readFile(path.join(source, `${name}-meta.json`), "utf8"),
  );
  if (
    meta.url !== "https://www.sunnyrf.com/" ||
    meta.width !== (name.startsWith("mobile") ? 390 : 1440)
  )
    throw new Error(`Unexpected source: ${name}`);
  await sharp(path.join(source, `${name}.png`))
    .resize({ width: name.startsWith("mobile") ? 780 : 1440 })
    .webp({ quality: 88 })
    .toFile(`${out}/screens/${name}.webp`);
}
// Stitch observed viewport positions, excluding overlap; only the floating quick menu
// was temporarily hidden for this long capture and restored afterwards.
let tiles = [];
for (let i = 0; i < 12; i++) {
  const meta = JSON.parse(
    await fs.readFile(path.join(source, `desktop-tile-${i}-meta.json`), "utf8"),
  );
  const next =
    i < 11
      ? JSON.parse(
          await fs.readFile(
            path.join(source, `desktop-tile-${i + 1}-meta.json`),
            "utf8",
          ),
        ).scrollY
      : 10076.5;
  const top = Math.round(meta.scrollY),
    height = Math.min(900, Math.round(next) - top);
  tiles.push({
    input: await sharp(path.join(source, `desktop-tile-${i}.png`))
      .extract({ left: 0, top: 0, width: 1425, height })
      .png()
      .toBuffer(),
    left: 0,
    top,
  });
}
await sharp({
  create: { width: 1425, height: 10077, channels: 3, background: "#fff" },
})
  .composite(tiles)
  .png()
  .toFile(path.join(source, "desktop-stitched.png"));
await sharp(path.join(source, "desktop-stitched.png"))
  .resize({ width: 1240 })
  .webp({ quality: 84 })
  .toFile(`${out}/thumb-web.webp`);
const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const text = (x, y, s, size = 32, fill = "#24231f", weight = 400) =>
  `<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(s)}</text>`;
const rect = (x, y, w, h, fill, rx = 0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const svg = (w, h, s) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${s}</svg>`,
  );
async function screen(name, w) {
  return sharp(`${out}/screens/${name}.webp`)
    .resize({ width: w })
    .png()
    .toBuffer();
}
const browser = (x, y, w) =>
  rect(x, y, w, 36, "#e9e7e1", 12) +
  text(x + 20, y + 25, "●  ●  ●", 16, "#a6a29b") +
  text(x + 140, y + 24, "sunnyrf.com", 16, "#77736d");
let bg = rect(0, 0, 1720, 6400, "#f5f2eb") + rect(0, 0, 1720, 520, "#ff6a20");
bg +=
  text(80, 95, "NUVIO / SELECTED WEBSITE", 24) +
  text(80, 285, "SUNNY", 180, "#25241f", 700) +
  text(85, 365, "MEDICAL DEVICE BRAND EXPERIENCE", 29);
bg += browser(80, 420, 1560);
bg +=
  text(80, 1550, "01 / PRODUCT & INFORMATION", 26, "#d25b20", 700) +
  text(80, 1610, "A clear introduction. A structured product story.", 40);
bg +=
  browser(80, 1670, 1020) +
  text(1160, 1765, "ONE PAGE.", 39, "#25241f", 700) +
  text(1160, 1820, "LAYERED DETAILS.", 39, "#25241f", 700);
[
  "Product introduction",
  "Handpiece information",
  "Technology sections",
  "FAQ & inquiry links",
].forEach((s, i) => {
  bg += text(1160, 1935 + i * 65, s, 25);
});
bg +=
  text(80, 2470, "02 / TECHNOLOGY IN VIEW", 26, "#d25b20", 700) +
  text(80, 2530, "Diagrams and typography share the same rhythm.", 40) +
  browser(80, 2600, 1560);
bg +=
  rect(0, 3730, 1720, 1720, "#242722") +
  text(80, 3850, "03 / RESPONSIVE EXPERIENCE", 26, "#ff8b4d", 700) +
  text(80, 3920, "The same product story, at a mobile width.", 43, "#fff");
for (const x of [80, 620, 1160])
  bg += rect(x - 10, 4010, 500, 1080, "#111411", 32);
bg +=
  text(80, 5185, "PRODUCT", 24, "#d2d6ce") +
  text(620, 5185, "INFORMATION CARDS", 24, "#d2d6ce") +
  text(1160, 5185, "TECHNOLOGY", 24, "#d2d6ce");
bg += text(
  80,
  5340,
  "390 × 844 CSS PX / REAL RESPONSIVE CAPTURES",
  22,
  "#a5b19f",
);
bg +=
  text(80, 5590, "ONE BRAND. ONE CONTINUOUS PAGE.", 52, "#25241f", 700) +
  text(
    80,
    5660,
    "Orange accents connect product imagery, information and inquiry.",
    31,
  );
bg +=
  rect(80, 5780, 1560, 1, "#c7c4bc") +
  text(80, 5870, "SOURCE", 22, "#77736d") +
  text(80, 5930, "www.sunnyrf.com", 40) +
  text(80, 6070, "Desktop 1440 × 900 / Mobile 390 × 844", 28) +
  text(80, 6240, "nuvio", 62, "#25241f", 700) +
  text(1180, 6240, "WEBSITE PORTFOLIO", 22);
await sharp(svg(1720, 6400, bg))
  .composite([
    { input: await screen("desktop-product", 1560), left: 80, top: 456 },
    { input: await screen("desktop-handpiece", 1020), left: 80, top: 1706 },
    { input: await screen("desktop-technology", 1560), left: 80, top: 2636 },
    ...(await Promise.all(
      ["mobile-product", "mobile-handpiece-final", "mobile-mode-final"].map(
        async (n, i) => ({
          input: await screen(n, 480),
          left: 80 + i * 540,
          top: 4030,
        }),
      ),
    )),
  ])
  .webp({ quality: 88 })
  .toFile(`${out}/portfolio.webp`);
// List thumbnail: one authentic product image, without UI collages or added copy.
const product = await sharp(path.join(source, "equipment.png"))
  .extract({ left: 650, top: 0, width: 1050, height: 2000 })
  .png()
  .toBuffer();
await sharp(product).webp({ quality: 94 }).toFile(`${out}/source-product.webp`);
const productLayer = await sharp(product)
  .resize({ height: 1740 })
  .png()
  .toBuffer();
const productMeta = await sharp(productLayer).metadata();
const thumbBackground = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1900"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#dae2df"/><stop offset="1" stop-color="#f2f1ed"/></linearGradient></defs><rect width="1600" height="1900" fill="url(#bg)"/></svg>`,
);
await sharp(thumbBackground)
  .composite([
    {
      input: productLayer,
      left: Math.round((1600 - productMeta.width) / 2),
      top: 80,
    },
  ])
  .webp({ quality: 90 })
  .toFile(`${out}/thumb.webp`);
let cover =
  rect(0, 0, 1920, 720, "#f5f2eb") +
  rect(0, 0, 740, 720, "#ff6a20") +
  text(85, 115, "NUVIO / WEBSITE", 24) +
  text(75, 345, "SUNNY", 150, "#25241f", 700) +
  text(85, 430, "MEDICAL DEVICE BRAND", 29) +
  text(85, 625, "Desktop & mobile experience", 25);
await sharp(svg(1920, 720, cover))
  .composite([
    { input: await screen("desktop-product", 1000), left: 800, top: 45 },
  ])
  .webp({ quality: 89 })
  .toFile(`${out}/cover.webp`);
for (const name of ["thumb", "thumb-web", "cover", "portfolio"]) {
  const file = `${out}/${name}.webp`,
    m = await sharp(file).metadata();
  console.log(file, m.width, m.height, (await fs.stat(file)).size);
}
