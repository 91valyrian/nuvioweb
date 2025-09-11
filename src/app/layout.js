// src/app/layout.js
import 'normalize.css';
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
    <html lang="ko">
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <Header />
        <main id="main" className="container">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}