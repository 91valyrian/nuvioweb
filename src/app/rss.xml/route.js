// src/app/rss.xml/route.js
import { getAllColumns } from "@/lib/columns";
import { getAllWorks } from "@/lib/works";

// ✅ XML 안전 변환 함수
function escapeXml(unsafe) {
  return unsafe
    ? unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
    : "";
}

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://nuvio-web.com";

  const now = new Date().toUTCString();

  const columns = getAllColumns().map(
    (c) => `
      <item>
        <title><![CDATA[${escapeXml(c.title)}]]></title>
        <link>${siteUrl}/columns/${c.slug}</link>
        <guid>${siteUrl}/columns/${c.slug}</guid>
        <pubDate>${new Date(c.date).toUTCString()}</pubDate>
        <description><![CDATA[${escapeXml(c.summary || "")}]]></description>
      </item>`
  );

  const works = getAllWorks().map(
    (w) => `
      <item>
        <title><![CDATA[${escapeXml(w.title)}]]></title>
        <link>${siteUrl}/work/${w.slug}</link>
        <guid>${siteUrl}/work/${w.slug}</guid>
        <pubDate>${new Date(w.date).toUTCString()}</pubDate>
        <description><![CDATA[${escapeXml(w.client || "")}]]></description>
      </item>`
  );

  // ✅ & → &amp; 로 수정됨
  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title><![CDATA[nuvio Feed — Columns &amp; Works]]></title>
      <link>${siteUrl}</link>
      <description><![CDATA[홈페이지 제작과 브랜딩 인사이트, nuvio의 최신 포트폴리오 및 칼럼]]></description>
      <language>ko</language>
      <lastBuildDate>${now}</lastBuildDate>
      ${[...columns, ...works].join("")}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
