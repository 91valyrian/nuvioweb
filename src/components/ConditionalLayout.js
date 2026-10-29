"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalCursor from "@/components/GlobalCursor";
import GlobalReveal from "@/components/GlobalReveal";
import FaqSection from "@/components/FaqSection";

/**
 * 랜딩페이지 경로에서는 Header/Footer 등을 제외하고 렌더링
 */
export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isLandingPage = pathname?.startsWith("/landing");

  // 랜딩페이지인 경우: Header/Footer 등 제외
  if (isLandingPage) {
    return (
      <>
        <div id="main" className="landing-page">
          {children}
        </div>
      </>
    );
  }

  // 일반 페이지: 기존 레이아웃 유지
  return (
    <>
      <GlobalCursor />
      <a href="#main" className="skip sr-only">
        Skip to content
      </a>
      <Header />

      <div id="main" className="content">
        {children}
      </div>
      <FaqSection />
      <GlobalReveal />

      {/* <QuickInquiry /> */}
      <Footer />
    </>
  );
}
