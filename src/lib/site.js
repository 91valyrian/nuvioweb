export const SITE_URL = "https://nuvio-web.com";
export const SITE_NAME = "nuvio";
export const isPreview = process.env.VERCEL_ENV === "preview";
export const indexableRobots = {
  index: !isPreview,
  follow: true,
  googleBot: { index: !isPreview, follow: true },
};
export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();
export const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
export function validDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}
export function pageMetadata({
  title,
  description,
  path,
  image = "/og/og-default.png",
  type = "website",
}) {
  return {
    robots: indexableRobots,
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: "ko_KR",
      type,
      images: [{ url: absoluteUrl(image) }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)],
    },
  };
}
export function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
