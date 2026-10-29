import { getAllColumns } from "@/lib/columns";
import { getAllWorks } from "@/lib/works";
import { absoluteUrl, validDate } from "@/lib/site";
import { services } from "@/data/services";
import { PAGE_SIZE, columnListUrl } from "@/lib/column-pagination";
export default function sitemap() {
  const columns = getAllColumns();
  const pages = [
    "/",
    "/about",
    "/service",
    "/work",
    "/columns",
    "/contact",
    "/landing",
    ...services.map((s) => `/service/${s.slug}`),
  ];
  return [
    ...pages.map((path) => ({ url: absoluteUrl(path) })),
    ...Array.from(
      { length: Math.ceil(columns.length / PAGE_SIZE) - 1 },
      (_, i) => ({ url: absoluteUrl(columnListUrl(i + 2)) }),
    ),
    ...getAllWorks().map((w) => ({
      url: absoluteUrl(`/work/${w.slug}`),
      lastModified: validDate(w.updated || w.inputDate),
    })),
    ...columns.map((p) => ({
      url: absoluteUrl(`/columns/${p.slug}`),
      lastModified: validDate(p.updated || p.date),
    })),
  ];
}
