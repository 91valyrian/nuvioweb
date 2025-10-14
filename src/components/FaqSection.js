"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function FaqSection() {
  const faqData = [
    {
      category: "홈페이지 제작",
      question: "홈페이지 제작 기간은 얼마나 걸리나요?",
      answer:
        "일반적으로 2~4주 정도 소요됩니다. 규모와 디자인 난이도에 따라 달라질 수 있습니다.",
    },
    {
      category: "홈페이지 제작",
      question: "모바일에서도 잘 보이나요?",
      answer:
        "네, 모든 홈페이지는 반응형으로 제작되어 PC, 태블릿, 모바일 환경에 맞게 최적화됩니다.",
    },
    {
      category: "유지보수",
      question: "유지보수는 어떻게 진행되나요?",
      answer: "정기 점검 및 요청 사항을 바탕으로 필요한 업데이트를 지원합니다.",
    },
    {
      category: "유지보수",
      question: "도메인과 호스팅도 함께 관리해주나요?",
      answer: "원하시는 경우 도메인과 호스팅 세팅 및 관리까지 대행 가능합니다.",
    },
    {
      category: "기타",
      question: "견적은 어떻게 확인할 수 있나요?",
      answer:
        "문의 페이지나 카카오톡 상담을 통해 맞춤 견적을 받아보실 수 있습니다.",
    },
  ];

  const categories = [...new Set(faqData.map((f) => f.category))];

  // 💡 마운트 이전에는 모든 동적 스타일을 ‘중립 상태’로 고정
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [openIndex, setOpenIndex] = useState(null);

  // 현재 필터된 리스트
  const filtered = faqData.filter((f) => f.category === activeCategory);

  // GSAP 패널 refs (필터된 리스트 기준)
  const panelsRef = useRef([]);

  // 카테고리 바뀌면 모든 패널 닫기 + 초기 상태 세팅
  useEffect(() => {
    panelsRef.current.forEach((panel) => {
      if (!panel) return;
      gsap.set(panel, { height: 0, opacity: 0 });
    });
  }, [activeCategory]);

  // 열림/닫힘 애니메이션
  useEffect(() => {
    // 마운트 전에는 애니메이션을 돌리지 않아 SSR/CSR 차이를 최소화
    if (!mounted) return;

    panelsRef.current.forEach((panel, idx) => {
      if (!panel) return;
      gsap.killTweensOf(panel);

      if (idx === openIndex) {
        const target = panel.scrollHeight;
        gsap.fromTo(
          panel,
          {
            height: panel.clientHeight,
            opacity: panel.style.opacity === "" ? 0 : 1,
          },
          {
            height: target,
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
            onComplete: () => gsap.set(panel, { height: "auto" }),
          }
        );
      } else {
        gsap.to(panel, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
        });
      }
    });
  }, [openIndex, mounted, activeCategory]);

  return (
    <section className="py-[180px] bg-neutral-950 text-white">
      <div className="container mx-auto px-4">
        <h3 className="section-subtitle text-[60px] leading-[74px] md:text-[49px] md:leading-[59px] font-bold text-center mb-[50px] rotate-x-up">
          자주 묻는 질문
        </h3>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => {
            const isActive = mounted && activeCategory === cat; // 마운트 전에는 항상 false → 중립 스타일 유지
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(null);
                }}
                className={[
                  "px-[30px] py-[15px] text-[28px] md:text-[18px] rounded-full border transition-all cursor-pointer font-semibold border-2 rotate-x-up",
                  isActive
                    ? "bg-white text-black border-white"
                    : "text-white/70 ",
                ].join(" ")}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* FAQ List */}
        <div className="max-w-[1000px] mx-auto space-y-4">
          {filtered.map((item, i) => (
            <div
              key={`${activeCategory}-${i}`}
              className="border border-white/10 rounded-xl overflow-hidden rotate-x-up"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className={`w-full flex justify-between items-center text-left px-[20px] py-[25px] md:py-[18px] hover:bg-white/5 transition cursor-pointer rotate-x-up ${mounted && openIndex === i ? "bg-white/5" : ""}`}
                aria-expanded={mounted ? openIndex === i : false}
                aria-controls={`faq-panel-${i}`}
              >
                <span className="text-[34px] md:text-[24px] font-medium">
                  {item.question}
                </span>
                <span className="text-[34px]">
                  {mounted && openIndex === i ? "−" : "+"}
                </span>
              </button>

              {/* 🔧 바깥 래퍼: height/opacity 애니메이션만 적용 (padding 없음) */}
              <div
                id={`faq-panel-${i}`}
                ref={(el) => (panelsRef.current[i] = el)}
                style={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {/* 안쪽 컨텐츠: padding은 여기서만 (SSR/CSR 동일 유지) */}
                <div className="px-[20px] py-[25px] md:py-[18px] text-white/70 text-[30px] md:text-[20px] border border-white/5 leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
