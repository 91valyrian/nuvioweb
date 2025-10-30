export async function generateMetadata() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com";
  return {
    title: "홈페이지 제작 문의 - 맞춤 견적 상담",
    description:
      "홈페이지 제작, 리뉴얼, SEO 컨설팅 등 다양한 프로젝트를 빠르고 정확하게 상담해드립니다. 지금 바로 문의하세요.",
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
