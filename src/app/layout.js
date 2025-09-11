// src/app/layout.js
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      <body className='text-white'>
        <a href="#main" className="skip sr-only">Skip to content</a>
        <Header />

        <div className="content">
            {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}