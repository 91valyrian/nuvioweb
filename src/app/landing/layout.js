const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://nuvio-web.com";

export async function generateMetadata() {
  const siteName = "nuvio";
  const seoTitle =
    "홈페이지 제작 전문 업체 | 기획부터 최적화까지 결과 중심 | 누비오";
  const description =
    "홈페이지 운영 걱정 해결 전문. 문의가 안 들어오는 홈페이지, 매출이 나지 않는 홈페이지 문제를 25년차 전문가가 직접 진단하고 해결합니다. 기획부터 최적화까지 결과로 증명하는 홈페이지 제작. 무료 진단으로 지금 바로 시작하세요. 24시간 내 전문가 연락.";

  return {
    title: seoTitle,
    description,
    keywords: [
      "홈페이지 문의 안 들어와요",
      "홈페이지 매출 없음",
      "홈페이지 운영 걱정",
      "홈페이지 제작",
      "랜딩페이지 제작",
      "서울 홈페이지 제작",
      "부산 홈페이지 제작",
      "홈페이지 리뉴얼",
      "홈페이지 진단",
    ],
    alternates: {
      canonical: `${SITE_URL}/landing`,
    },
    openGraph: {
      type: "website",
      siteName,
      url: `${SITE_URL}/landing`,
      title: seoTitle,
      description,
      images: [
        {
          url: "/og/og-default.png",
          width: 1200,
          height: 630,
          alt: "홈페이지 제작 전문 업체 | 기획부터 최적화까지 결과 중심 | 누비오",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
      images: ["/og/og-default.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function LandingLayout({ children }) {
  return <>{children}</>;
}
