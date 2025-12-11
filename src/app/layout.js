// src/app/layout.js
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import QuickInquiry from "@/components/QuickInquiry";
import GlobalCursor from "@/components/GlobalCursor";
import GlobalReveal from "@/components/GlobalReveal";
import FaqSection from "@/components/FaqSection";
import { Analytics } from "@vercel/analytics/next";

import Script from "next/script";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const siteName = "nuvio";
const siteUrl = "https://nuvio-web.com"; // 배포 도메인으로 교체
const defaultTitle =
  "홈페이지 제작 전문 · 기업·병원·프랜차이즈 브랜딩 웹사이트 | nuvio";
const defaultDesc =
  "기획·디자인·개발·SEO까지 한 번에 설계하는 전략형 홈페이지 제작 스튜디오입니다. 기업·병원·프랜차이즈에 맞춘 브랜딩 웹사이트로 신뢰와 전환을 동시에 높여드립니다.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDesc,
  keywords: [
    "홈페이지 제작",
    "홈페이지 제작 전문",
    "기업 홈페이지 제작",
    "병원 홈페이지 제작",
    "프랜차이즈 홈페이지 제작",
    "로펌 홈페이지 제작",
    "법률사무소 홈페이지 제작",
    "브랜드 홈페이지 제작",
    "전략형 홈페이지 제작",
    "반응형 홈페이지",
    "nuvio",
    "누비오",
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
        {/* ✅ Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XS0LDTNCMH"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XS0LDTNCMH', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        {/* End Google Analytics */}
        <Script
          id="beusable-rum"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w, d, a){
              w.__beusablerumclient__ = {
                  load : function(src){
                      var b = d.createElement("script");
                      b.src = src; b.async=true; b.type = "text/javascript";
                      d.getElementsByTagName("head")[0].appendChild(b);
                  }
              };
              w.__beusablerumclient__.load(a + "?url=" + encodeURIComponent(d.URL));
          })(window, document, "//rum.beusable.net/load/b251031e102356u405");`,
          }}
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
        <link rel="stylesheet" href="https://use.typekit.net/qql5rly.css" />
      </head>
      <body className="text-white">
        <AnalyticsTracker />
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

        {/* <QuickInquiry /> */}
        <Footer />
      </body>
    </html>
  );
}
