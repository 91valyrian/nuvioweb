export async function generateMetadata() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com";
  return {
    title: "홈페이지 제작 문의 - 맞춤 견적·리뉴얼·SEO 상담",
    description:
      "홈페이지 제작·리뉴얼·랜딩페이지·쇼핑몰·SEO 컨설팅까지 프로젝트 정보를 남겨주시면 예산에 맞는 현실적인 견적과 진행 방향을 안내드립니다. 카카오톡을 포함한 빠른 상담을 제공합니다.",
    keywords: [
      "홈페이지 제작 문의",
      "홈페이지 제작 견적",
      "홈페이지 리뉴얼 상담",
      "SEO 컨설팅 문의",
      "기업 홈페이지 견적",
      "병원 홈페이지 제작 견적",
      "프랜차이즈 홈페이지 제작 문의",
      "랜딩페이지 제작 견적",
    ],
    alternates: { canonical: `${base}/contact` },
    openGraph: { images: [{ url: "/og/og-default.png" }] },
    twitter: { images: ["/og/og-default.png"] },
  };
}

export default function ContactLayout({ children }) {
  return <>{children}</>;
}
