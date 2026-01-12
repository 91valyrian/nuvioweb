"use client";

import LandingPortfolioClient from "./LandingPortfolioClient";

export default function LandingPortfolioSection() {
  return (
    <section
      id="section-portfolio"
      className="py-[150px] md:py-[100px] bg-[#141414] border-t border-white/5"
    >
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 scroll-anim">
          <div>
            <span className="text-[#a78bfa] font-bold tracking-wider uppercase text-[28px] md:text-[16px] mb-2 block">
              Our Portfolio
            </span>
            <h2 className="text-[54px] md:text-[44px] font-bold leading-tight mb-4 text-white">
              기획부터 최적화까지,
              <br />
              <span className="text-[#a78bfa]">결과로 증명하는</span>
              누비오의
              <br className="block md:hidden" /> 제작 사례
            </h2>
            <p className="text-white/60 text-[30px] md:text-[20px] mt-4">
              누비오를 만난 사장님들의 변화입니다.
            </p>
          </div>
          <a
            href="#section-consult"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-[18px] md:text-[16px] font-bold rounded-[9999px] hover:shadow-lg hover:shadow-[#6366f1]/30 transition-all duration-300 transform hover:-translate-y-0.5 mt-6 md:mt-0"
          >
            내 성공 사례 만들기
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>

        <LandingPortfolioClient />

        <div className="mt-8 text-center md:hidden">
          <a
            href="#section-consult"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-[30px] md:text-[20px] font-bold rounded-[9999px] shadow-lg shadow-[#6366f1]/30 hover:shadow-[#6366f1]/50 transition-all transform hover:-translate-y-1"
          >
            내 성공 사례 만들기
            <svg
              className="md:w-5 md:h-5 w-8 h-8 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
