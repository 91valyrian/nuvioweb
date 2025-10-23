// src/app/sitemap.js
import { getAllColumns } from "@/lib/columns";
import { getAllWorks } from "@/lib/works"; // ✅ 이 줄을 여기 추가!

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://nuvio-web.com";

export default async function sitemap() {
  const now = new Date();

  // 고정 페이지
  const staticPages = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/service`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/work`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/columns`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.9 },
  ].map((i) => ({ ...i, lastModified: now }));

  // Work(포트폴리오) 동적 페이지
  const works = getAllWorks().map((w) => ({
    url: `${SITE_URL}/work/${w.slug}`,
    lastModified: w.date ? new Date(w.date) : now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Columns(칼럼) 동적 페이지
  const columns = getAllColumns().map((c) => ({
    url: `${SITE_URL}/columns/${c.slug}`,
    lastModified: c.date ? new Date(c.date) : now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticPages, ...works, ...columns];
}
