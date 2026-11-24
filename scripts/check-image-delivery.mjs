import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";

// Exercise the actual browser's srcset selection, rather than reimplementing it.
const base = process.argv[2] || "http://127.0.0.1:3100";
const cli = process.env.ORCA_CLI_COMMAND || (process.env.ORCA_DEV_REPO_ROOT ? "orca-dev" : "orca");
function orca(args) {
  const data = JSON.parse(execFileSync(cli, [...args, "--json"], {
    encoding: "utf8", maxBuffer: 4 * 1024 * 1024,
  }));
  assert(data.ok, JSON.stringify(data.error));
  return data.result;
}

const html = await (await fetch(base)).text();
assert(!/<link[^>]*rel="stylesheet"[^>]*(?:typekit|pretendard)/i.test(html), "External font CSS blocks initial rendering");
const results = [];
for (const [width, dpr] of [[390, 1], [1200, 1], [1440, 1], [390, 2], [1200, 2]]) {
  const { browserPageId: page } = orca(["tab", "create", "--url", base]);
  try {
    orca(["viewport", "--page", page, "--width", String(width), "--height", "900", "--scale", String(dpr), ...(width < 768 ? ["--mobile"] : [])]);
    // Reload after viewport selection so an earlier large candidate isn't reused.
    orca(["reload", "--page", page]);
    orca(["viewport", "--page", page, "--width", String(width), "--height", "900", "--scale", String(dpr), ...(width < 768 ? ["--mobile"] : [])]);
    for (const [kind, selector] of [
      ["column", '[aria-labelledby="columns-heading"] img'],
      ["work", ".card-media img"],
    ]) {
      const expression = `(async () => {
        const img = document.querySelector(${JSON.stringify(selector)});
        if (!img) throw new Error('Missing audit image');
        img.scrollIntoView({ block: 'center', behavior: 'instant' });
        const fresh = url => { const u = new URL(url, location.href); u.searchParams.set('deliveryAudit', Date.now()); return u.href; };
        img.srcset = img.srcset.split(', ').map(candidate => { const [url, size] = candidate.split(' '); return fresh(url) + ' ' + size; }).join(', ');
        img.src = fresh(img.src);
        await Promise.race([img.decode(), new Promise((_, reject) => setTimeout(() => reject(new Error('Image did not load')), 15000))]);
        const rect = img.getBoundingClientRect();
        return JSON.stringify({ width: rect.width, height: rect.height, dpr: devicePixelRatio, url: img.currentSrc, sizes: img.sizes, aspectRatio: img.naturalWidth / img.naturalHeight, bytes: performance.getEntriesByName(img.currentSrc).at(-1)?.encodedBodySize });
      })()`;
      const value = JSON.parse(orca(["eval", "--page", page, "--expression", expression]).result);
      const selected = Number(new URL(value.url).searchParams.get("w"));
      // Portrait work cards use object-fit:cover: allow the pixels needed for height.
      const required = (kind === "work" ? Math.max(value.width, value.height * value.aspectRatio) : value.width) * value.dpr;
      assert.equal(value.dpr, dpr, "DPR scenario was not applied");
      assert(value.bytes > 0, "Missing transfer measurement");
      results.push({ viewport: width, dpr, kind, rendered: Math.round(value.width), selected, bytes: value.bytes, budget: Math.ceil(required * 1.5), pass: selected >= required * 0.95 && selected <= required * 1.5 });
    }
  } finally {
    orca(["tab", "close", "--page", page]);
  }
}
console.table(results);
assert(results.every(row => row.pass), "Card image candidate is oversized or insufficient for its rendered dimensions");
