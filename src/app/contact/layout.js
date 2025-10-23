export async function generateMetadata() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com";
  return {
    title: "홈페이지 제작 상담 | 기업·병원·프랜차이즈 맞춤 견적 문의",
    description:
      "홈페이지 제작 상담과 견적 문의, 기획부터 디자인·SEO까지 전문 웹스튜디오",
    keywords: [
      "홈페이지 제작 비용",
      "홈페이지 비용",
      "홈페이지 제작 문의",
      "홈페이지 제작 견적",
      "기업 홈페이지 제작",
      "웹사이트 제작",
      "홈페이지 리뉴얼",
      "홈페이지 견적",
      "홈페이지 견적 문의",
      "홈페이지 제작 문의",
      "맞춤형 웹사이트 제작",
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
