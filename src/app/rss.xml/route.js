import { getAllColumns, getColumnBySlug } from "@/lib/columns";
import { getAllWorks } from "@/lib/works";
import { SITE_URL, absoluteUrl, validDate, stripHtml } from "@/lib/site";
const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
const cdata = (value = "") =>
  `<![CDATA[${String(value).replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;
export function GET() {
  const posts = [
    ...getAllColumns().map((p) => ({
      title: p.title,
      path: `/columns/${p.slug}`,
      date: p.date,
      modified: p.updated || p.date,
      description: getColumnBySlug(p.slug).content,
    })),
    ...getAllWorks().map((w) => ({
      title: stripHtml(w.title),
      path: `/work/${w.slug}`,
      date: w.inputDate,
      modified: w.updated || w.inputDate,
      description: stripHtml(w.overview || w.client),
    })),
  ].sort((a, b) =>
    (validDate(b.date) || "").localeCompare(validDate(a.date) || ""),
  );
  const items = posts
    .map(
      (p) =>
        `<item><title>${cdata(p.title)}</title><link>${escapeXml(absoluteUrl(p.path))}</link><guid isPermaLink="true">${escapeXml(absoluteUrl(p.path))}</guid>${validDate(p.date) ? `<pubDate>${new Date(p.date).toUTCString()}</pubDate>` : ""}<description>${cdata(p.description)}</description></item>`,
    )
    .join("");
  const modified = posts
    .map((p) => validDate(p.modified))
    .filter(Boolean)
    .sort()
    .at(-1);
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>nuvio — 홈페이지 제작 칼럼</title><link>${SITE_URL}</link><description>홈페이지 제작 가이드와 누비오 제작 사례</description><language>ko</language>${modified ? `<lastBuildDate>${new Date(modified).toUTCString()}</lastBuildDate>` : ""}${items}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
}
