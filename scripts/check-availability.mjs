// Read-only probe: safe to use with an uptime service or a manual CI run.
import assert from "node:assert/strict";
const base = process.argv[2] || "https://nuvio-web.com";
for (const path of [
  "/",
  "/robots.txt",
  "/sitemap.xml",
  "/columns",
  "/contact",
]) {
  const response = await fetch(new URL(path, base), {
    signal: AbortSignal.timeout(15000),
    redirect: "follow",
  });
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  const text = await response.text();
  if (path === "/robots.txt")
    assert(text.includes("Sitemap: https://nuvio-web.com/sitemap.xml"));
  if (path === "/sitemap.xml")
    assert(text.includes("<urlset") && text.includes("<loc>"));
  console.log(`OK ${new URL(path, base)}`);
}
