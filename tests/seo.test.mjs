import test from "node:test";
import assert from "node:assert/strict";
import { getAllColumns, getColumnBySlug } from "../src/lib/columns.js";
import { getAllWorks, getWorkBySlug } from "../src/lib/works.js";
import {
  paginateColumns,
  columnListUrl,
  PAGE_SIZE,
} from "../src/lib/column-pagination.js";
import { getRelatedColumns } from "../src/lib/column-relations.js";
import { absoluteUrl, jsonLd, validDate } from "../src/lib/site.js";
import { matchingServices } from "../src/data/services.js";
test("pagination exposes every article once across stable URLs", () => {
  const posts = getAllColumns();
  const seen = [];
  for (let page = 1; page <= Math.ceil(posts.length / PAGE_SIZE); page++) {
    const state = paginateColumns(posts, { page: String(page) });
    assert(state.valid);
    seen.push(...state.visible.map((p) => p.slug));
    assert.equal(
      new URL(columnListUrl(page), "https://test.invalid").searchParams.get(
        "page",
      ),
      page === 1 ? null : String(page),
    );
  }
  assert.equal(new Set(seen).size, posts.length);
  assert.equal(seen.length, posts.length);
});
test("invalid pagination and categories do not silently duplicate page one", () => {
  const posts = getAllColumns();
  for (const page of ["0", "-1", "abc", "1.5", "999", ["1", "2"]])
    assert.equal(paginateColumns(posts, { page }).valid, false);
  assert.equal(paginateColumns(posts, { category: "unknown" }).valid, false);
  const cat = posts[0].categories[0];
  assert(
    paginateColumns(posts, { category: cat }).visible.every((p) =>
      p.categories.includes(cat),
    ),
  );
});
test("missing and unsafe slugs return null; all published slugs still resolve", () => {
  for (const slug of ["missing-seo-test", "../package", "a/b", "", undefined]) {
    assert.equal(getColumnBySlug(slug), null);
    assert.equal(getWorkBySlug(slug), null);
  }
  for (const p of getAllColumns())
    assert.equal(getColumnBySlug(p.slug).slug, p.slug);
  for (const p of getAllWorks())
    assert.equal(getWorkBySlug(p.slug).slug, p.slug);
});
test("recommendations are deterministic, exclude self and prefer shared topics", () => {
  const post = { slug: "self", tags: ["병원"], categories: ["팁"] };
  const posts = [
    post,
    { slug: "unrelated", tags: [], date: "2026-10-29" },
    { slug: "related", tags: ["병원"], date: "2025-01-01" },
  ];
  assert.equal(getRelatedColumns(post, posts)[0].slug, "related");
  assert.deepEqual(
    getRelatedColumns(post, posts),
    getRelatedColumns(post, posts),
  );
  assert(!getRelatedColumns(post, posts).some((p) => p.slug === "self"));
  assert.equal(matchingServices("병원 홈페이지 제작")[0].slug, "hospital");
});
test("structured data cannot close script tags and canonical URLs stay on production", () => {
  const serialized = jsonLd({ name: "</script><script>alert(1)</script>" });
  assert(!serialized.includes("<"));
  assert.equal(
    JSON.parse(serialized).name,
    "</script><script>alert(1)</script>",
  );
  assert.equal(
    absoluteUrl("/work/hanzzim"),
    "https://nuvio-web.com/work/hanzzim",
  );
  assert.equal(validDate(undefined), undefined);
  assert.equal(validDate("invalid"), undefined);
  assert.equal(validDate("2025-12-03"), "2025-12-03T00:00:00.000Z");
});

test("a failed inquiry is never acknowledged as delivered; either channel is enough", async () => {
  const { inquiryAccepted } = await import("../src/lib/inquiry-delivery.js");
  assert.equal(inquiryAccepted(null, false), false);
  assert.equal(inquiryAccepted({ id: "saved" }, false), true);
  assert.equal(inquiryAccepted(null, true), true);
  assert.equal(inquiryAccepted({ id: "saved" }, true), true);
});

test("preview metadata blocks indexing for generic and Google crawlers", async () => {
  const { execFileSync } = await import("node:child_process");
  const output = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      'import {pageMetadata} from "./src/lib/site.js"; console.log(JSON.stringify(pageMetadata({title:"preview",description:"preview",path:"/service"}).robots))',
    ],
    { env: { ...process.env, VERCEL_ENV: "preview" }, encoding: "utf8" },
  );
  const robots = JSON.parse(output.trim());
  assert.equal(robots.index, false);
  assert.equal(robots.googleBot.index, false);
});

test("editorial type keeps physical size while legacy layout still scales", async () => {
  const { default: postcss } = await import("postcss");
  const { default: pxtorem } = await import("postcss-pxtorem");
  const { default: config } = await import("../postcss.config.js");
  const result = await postcss([
    pxtorem(config.plugins["postcss-pxtorem"]),
  ]).process(
    ".column-article{font-size:20px}.service-detail p{font-size:18px}.legacy{font-size:20px}",
    { from: undefined },
  );
  assert(result.css.includes(".column-article{font-size:20px}"));
  assert(result.css.includes(".service-detail p{font-size:18px}"));
  assert(result.css.includes(".legacy{font-size:1.25rem}"));
});

test("portfolio body width remains capped in physical pixels after PostCSS", async () => {
  const { readFileSync } = await import("node:fs");
  const { default: postcss } = await import("postcss");
  const { default: pxtorem } = await import("postcss-pxtorem");
  const { default: config } = await import("../postcss.config.js");
  const css = readFileSync("src/components/work/work-detail.css", "utf8");
  const result = await postcss([
    pxtorem(config.plugins["postcss-pxtorem"]),
  ]).process(css, { from: undefined });
  assert.match(result.css, /max-width:\s*1200px/);
  assert.match(result.css, /max-width:\s*1000px/);
  assert.match(result.css, /font-size:\s*20px/);
  assert(!result.css.includes("75rem"));
});
