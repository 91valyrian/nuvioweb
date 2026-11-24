import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";
const base = process.argv[2] || "http://127.0.0.1:3200";
const cli = process.env.ORCA_CLI_COMMAND || (process.env.ORCA_DEV_REPO_ROOT ? "orca-dev" : "orca");
function orca(args) {
  const data = JSON.parse(execFileSync(cli, [...args, "--json"], { encoding: "utf8", maxBuffer: 4 * 1024 * 1024 }));
  assert(data.ok, JSON.stringify(data.error));
  return data.result;
}
const { browserPageId: page } = orca(["tab", "create", "--url", base + "/columns"]);
const evaluate = expression => JSON.parse(orca(["eval", "--page", page, "--expression", expression]).result);
try {
  orca(["viewport", "--page", page, "--width", "1200", "--height", "500", "--scale", "1"]);
  const cursor = evaluate(`(async () => {
    const link = document.querySelector('header a');
    const cursor = document.querySelector('[aria-hidden=true][style*="will-change"]');
    link.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, relatedTarget: document.body }));
    await new Promise(requestAnimationFrame);
    const entered = cursor.style.transform;
    link.dispatchEvent(new PointerEvent('pointerout', { bubbles: true, relatedTarget: document.body }));
    await new Promise(requestAnimationFrame);
    return JSON.stringify({ entered, left: cursor.style.transform });
  })()`);
  orca(["eval", "--page", page, "--expression", "document.querySelector('header a').click()"]);
  orca(["wait", "--page", page, "--selector", ".hero-next"]);
  const shortHeight = evaluate("JSON.stringify(innerHeight)");
  orca(["viewport", "--page", page, "--width", "1200", "--height", "900", "--scale", "1"]);
  const service = evaluate(`(async () => {
    const section = document.querySelector('#services');
    section.scrollIntoView({ behavior: 'instant', block: 'start' });
    for (let i = 0; i < 20 && section.dataset.pinned !== 'true'; i++) await new Promise(resolve => setTimeout(resolve, 100));
    return JSON.stringify({ pinned: section.dataset.pinned, links: section.querySelectorAll('a[href^="/service/"]').length });
  })()`);
  const fonts = evaluate(`JSON.stringify([...document.fonts].filter(face => face.family === 'miller-banner').map(face => face.display))`);
  console.log({ cursor, shortHeight, service, fonts });
  assert(cursor.entered.includes("scale(4)"), "Cursor doesn't expand over a link");
  assert(cursor.left.includes("scale(1)"), "Cursor doesn't reset after leaving a link");
  assert.equal(shortHeight, 500, "Short-height scenario was not exercised");
  assert.equal(service.pinned, "true", "Service animation doesn't activate after a short viewport grows");
  assert.equal(service.links, 6);
  assert(fonts.length > 0 && fonts.every(display => display === "swap"), "Font display resets after responsive layout changes");
} finally {
  orca(["tab", "close", "--page", page]);
}
