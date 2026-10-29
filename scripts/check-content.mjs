import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import matter from "gray-matter";
import sharp from "sharp";
import { services } from "../src/data/services.js";
const routes = new Set([
  "/",
  "/about",
  "/service",
  "/work",
  "/columns",
  "/contact",
  "/landing",
  ...services.map((s) => `/service/${s.slug}`),
]);
const entries = [];
for (const folder of ["columns", "work"]) {
  for (const name of fs
    .readdirSync(`content/${folder}`)
    .filter((n) => n.endsWith(".mdx"))) {
    const file = `content/${folder}/${name}`;
    const { data, content } = matter(fs.readFileSync(file, "utf8"));
    assert.equal(
      data.slug,
      name.slice(0, -4),
      `${file}: slug must match filename`,
    );
    const route = `/${folder}/${data.slug}`;
    assert(!routes.has(route), `${file}: duplicate route`);
    routes.add(route);
    const date = data.date || data.inputDate;
    assert(
      date && Number.isFinite(Date.parse(date)),
      `${file}: invalid publication date`,
    );
    if (data.updated)
      assert(
        Number.isFinite(Date.parse(data.updated)),
        `${file}: invalid modification date`,
      );
    entries.push({ file, data, content, folder });
  }
}
for (const { file, data, content, folder } of entries) {
  assert(data.title, `${file}: missing title`);
  if (folder === "columns") {
    for (const field of ["summary", "thumbnail", "thumbnailAlt", "author"])
      assert(data[field], `${file}: missing ${field}`);
    assert(
      Array.isArray(data.categories) && data.categories.length,
      `${file}: missing categories`,
    );
    assert(!/^#\s/m.test(content), `${file}: renderer already supplies H1`);
  }
  const assets = [
    data.thumbnail,
    data.cover,
    ...[...content.matchAll(/(?:src=["']|!\[[^\]]*\]\()(\/[^"')\s]+)/g)].map(
      (m) => m[1],
    ),
  ].filter(Boolean);
  for (const asset of assets.filter((a) => a.startsWith("/")))
    assert(
      fs.existsSync(path.join("public", asset)),
      `${file}: missing asset ${asset}`,
    );
  for (const match of content.matchAll(
    /(?<!!)\[[^\]]+\]\((\/[^)]+)\)|href=["'](\/[^"']+)/g,
  )) {
    const link = (match[1] || match[2]).split(/[?#]/)[0];
    assert(
      routes.has(link) || fs.existsSync(path.join("public", link)),
      `${file}: broken link ${link}`,
    );
  }
}
const newPost = entries.find(
  (p) => p.data.slug === "website-renewal-seo-checklist",
);
for (const name of ["thumbnail", "url-map", "launch-check"]) {
  const file = `public/images/columns/${newPost.data.slug}/${name}.webp`;
  const meta = await sharp(file).metadata();
  assert.equal(meta.width, 1600);
  assert.equal(meta.height, 900);
  assert(fs.statSync(file).size < 300 * 1024, `${file}: image exceeds 300KB`);
}
for (const s of services) {
  for (const slug of s.work)
    assert(routes.has(`/work/${slug}`), `service ${s.slug}: missing work`);
  for (const slug of s.columns)
    assert(routes.has(`/columns/${slug}`), `service ${s.slug}: missing column`);
}
console.log(
  `Content OK: ${entries.filter((p) => p.folder === "columns").length} columns, ${entries.filter((p) => p.folder === "work").length} portfolios, ${services.length} services; links/assets/dates valid.`,
);
