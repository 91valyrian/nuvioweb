// src/app/layout.js
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickInquiry from "@/components/QuickInquiry";
import GlobalCursor from "@/components/GlobalCursor";

export const metadata = {
  title: "NUVIO — Branding Websites",
  description: "Perfect first impressions. Websites that elevate brand value.",
  metadataBase: new URL("https://example.com"), // 배포 도메인으로 교체
  openGraph: {
    title: "NUVIO — Branding Websites",
    description: "Perfect first impressions. Websites that elevate brand value.",
    url: "https://example.com",
    siteName: "NUVIO",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
        <link rel="stylesheet" href="https://use.typekit.net/qql5rly.css" />
      </head>
      <body className='text-white'>
        <GlobalCursor />
        <a href="#main" className="skip sr-only">Skip to content</a>
        <Header />

        <div className="content">
            {children}
        </div>
        <QuickInquiry />
        <Footer />
      </body>
    </html>
  );
}