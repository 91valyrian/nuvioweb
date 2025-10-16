export async function generateMetadata() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com";
  return {
    title:
      "홈페이지 제작 문의 및 견적 요청 — 맞춤형 기업·병원·프랜차이즈 웹사이트 제작 상담",
    description:
      "홈페이지 제작 상담 및 견적 문의. nuvio는 기업, 병원, 프랜차이즈 등 다양한 산업의 맞춤형 웹사이트를 기획부터 개발, SEO까지 전문적으로 제공합니다.",
    keywords: [
      "홈페이지 제작 비용",
      "홈페이지 비용",
      "홈페이지 제작 문의",
      "홈페이지 제작 견적",
      "기업 홈페이지 제작",
      "웹사이트 제작",
      "홈페이지 리뉴얼",
      "SEO 최적화",
      "nuvio",
    ],
    alternates: { canonical: `${base}/contact` },
    openGraph: { images: [{ url: "/og/og-default.png" }] },
    twitter: { images: ["/og/og-default.png"] },
  };
}

export default function ContactLayout({ children }) {
  return <>{children}</>;
}
