import assert from "node:assert/strict";
const base = process.argv[2] || "http://127.0.0.1:3100";
const get = async (path, options) => {
  const response = await fetch(new URL(path, base), options);
  return { response, text: await response.text() };
};
const sitemap = await get("/sitemap.xml");
assert.equal(sitemap.response.status, 200);
const urls = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) =>
  m[1].replace(/&amp;/g, "&"),
);
assert(urls.length >= 65);
assert(urls.every((url) => url.startsWith("https://nuvio-web.com/")));
let checked = 0;
for (let i = 0; i < urls.length; i += 4) {
  await Promise.all(
    urls.slice(i, i + 4).map(async (url) => {
      const path = new URL(url).pathname + new URL(url).search;
      const { response, text } = await get(path);
      assert.equal(response.status, 200, path);
      assert(text.includes('rel="canonical"'), `${path}: missing canonical`);
      assert(
        !/https?:\/\/(?:www\.)?nuvio\.kr(?:[\/:"]|$)/.test(text),
        `${path}: stale domain`,
      );
      const schemas = [
        ...text.matchAll(
          /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
        ),
      ].map((m) => JSON.parse(m[1]));
      assert(schemas.length, `${path}: missing server JSON-LD`);
      if (path.startsWith("/columns/"))
        assert(
          schemas.some((s) => JSON.stringify(s).includes('"@type":"Article"')),
          `${path}: missing Article`,
        );
      checked++;
    }),
  );
}
const page1 = await get("/columns"),
  page2 = await get("/columns?page=2");
assert.notEqual(page1.text, page2.text);
assert(page2.text.includes("https://nuvio-web.com/columns?page=2"));
assert(page1.text.includes('href="/columns?page=2"'));
for (const path of [
  "/columns/missing-seo-test",
  "/work/missing-seo-test",
  "/columns?page=999",
  "/service/missing-seo-test",
]) {
  const { response, text } = await get(path);
  assert.equal(response.status, 404, path);
  assert(!text.includes("NEXT_HTTP_ERROR_FALLBACK;500"));
}
const backup = await get("/landing_bak", { redirect: "manual" });
assert.equal(backup.response.status, 308);
assert.equal(backup.response.headers.get("location"), "/landing");
for (const path of ["/admin/pixel", "/admin/inquiries"]) {
  const { text } = await get(path);
  assert(/name="robots" content="noindex, nofollow"/.test(text), path);
  assert(/name="googlebot" content="noindex, nofollow/.test(text), path);
}
const rss = await get("/rss.xml");
assert.equal(rss.response.status, 200);
assert(!rss.text.includes("Invalid Date"));
assert(!rss.text.includes("&amp;amp;"));
const dates = [...rss.text.matchAll(/<pubDate>(.*?)<\/pubDate>/g)];
assert(dates.length >= 53);
assert(dates.every((m) => Number.isFinite(Date.parse(m[1]))));
console.log(
  `Site OK: ${checked} sitemap URLs, canonical/JSON-LD, pagination, 404, 308, admin noindex and RSS dates.`,
);
