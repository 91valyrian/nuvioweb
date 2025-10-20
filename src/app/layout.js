// src/app/layout.js
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import QuickInquiry from "@/components/QuickInquiry";
import GlobalCursor from "@/components/GlobalCursor";
import GlobalReveal from "@/components/GlobalReveal";
import InQuiry from "@/components/InQuiry";
import FaqSection from "@/components/FaqSection";
import { Analytics } from "@vercel/analytics/next";

const siteName = "nuvio";
const siteUrl = "https://nuvio-web.com"; // 배포 도메인으로 교체
const defaultTitle = "홈페이지 제작 | 브랜드가 성장하는 웹사이트 – nuvio";
const defaultDesc =
  "단순한 홈페이지 제작이 아닌, 브랜드의 방향성을 설계합니다. nuvio는 기획과 디자인, 그리고 SEO까지 일관된 시선으로 연결해 감각과 성과가 공존하는 웹사이트를 만듭니다.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s - ${siteName}`,
  },
  description: defaultDesc,
  keywords: [
    "홈페이지 제작",
    "기업 홈페이지 제작",
    "웹사이트 제작",
    "반응형 홈페이지",
    "홈페이지 리뉴얼",
    "브랜드 홈페이지 제작",
    "학교 홈페이지 제작",
    "교회 홈페이지 제작",
    "병원 홈페이지 제작",
    "SEO 홈페이지 제작",
    "랜딩 페이지 제작",
    "홈페이지 제작 견적",
    "홈페이지 제작 비용",
    "웹에이전시",
    "검색엔진노출",
    "nuvio",
    "누비오",
    "상위노출",
  ],
  applicationName: siteName,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDesc,
    locale: "ko_KR",
    images: [
      {
        url: "/og/og-default.png", // 1200x630 권장
        width: 1200,
        height: 630,
        alt: "홈페이지 제작 nuvio — 새로운 관점으로 디자인합니다.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDesc,
    images: ["/og/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteUrl, // 각 페이지에서 덮어씀
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  other: {
    "naver-site-verification": "0876717f42ba0375798681e5ad837f1bbb7edce7", // 있으면
  },
};

export const viewport = {
  themeColor: "#111827",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="scrollbar-dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
        <link rel="stylesheet" href="https://use.typekit.net/qql5rly.css" />
      </head>
      <body className="text-white">
        <GlobalCursor />
        <a href="#main" className="skip sr-only">
          Skip to content
        </a>
        <Header />

        <main id="main" className="content">
          {children}
          <Analytics />
        </main>
        <FaqSection />
        <GlobalReveal />
        <InQuiry />
        {/* <QuickInquiry /> */}
        <Footer />
      </body>
    </html>
  );
}
