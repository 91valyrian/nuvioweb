// src/app/layout.js
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import ConditionalLayout from "@/components/ConditionalLayout";

const siteName = "nuvio";
const siteUrl = "https://nuvio-web.com"; // 배포 도메인으로 교체
const defaultTitle =
  "홈페이지 제작 | 검색되는 구조로 문의를 만드는 웹사이트 – nuvio"; //매출이 2배 오르는 홈페이지 제작 | 검색되는 구조로 문의를 만드는 웹사이트 – nuvio
const defaultDesc =
  "홈페이지 제작에서 중요한 것은 디자인이 아니라 구조입니다. nuvio는 기획·디자인·개발·SEO·AEO를 통합해 검색되는 구조부터 문의로 이어지는 웹사이트를 설계합니다. 기업·병원·프랜차이즈 맞춤 제작.";

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
    "반응형 홈페이지",
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
        {/* Facebook / Meta Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1532252177885828');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1532252177885828&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Facebook Pixel */}
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
        <ConditionalLayout>{children}</ConditionalLayout>
        <Analytics />
      </body>
    </html>
  );
}
