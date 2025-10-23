// src/app/sitemap.js
import { getAllColumns } from "@/lib/columns";
import { getAllWorks } from "@/lib/work";

/**
 * 베이스 URL은 .env에서 NEXT_PUBLIC_SITE_URL 로 관리 (예: https://nuvio-web.com)
 * 없으면 프로덕션 가정 값으로 fallback
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://nuvio-web.com";

export default async function sitemap() {
  // 고정 페이지
  const staticPages = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/work`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/columns`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ].map((item) => ({
    ...item,
    lastModified: new Date(),
  }));

  // Work(포트폴리오) 동적 페이지
  const works =
    getAllWorks()?.map((w) => ({
      url: `${SITE_URL}/work/${w.slug}`,
      lastModified: w.date ? new Date(w.date) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })) ?? [];

  // Columns(칼럼) 동적 페이지
  const columns =
    getAllColumns()?.map((c) => ({
      url: `${SITE_URL}/columns/${c.slug}`,
      lastModified: c.date ? new Date(c.date) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    })) ?? [];

  return [...staticPages, ...works, ...columns];
}
