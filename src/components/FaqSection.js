"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function FaqSection() {
  const faqData = [
    // 1️⃣ 제작·견적
    {
      category: "제작·견적",
      question: "제작 비용은 어느 정도인가요?",
      answer: `홈페이지 제작 비용은 프로젝트의 규모와 필요한 기능, 디자인 방향에 따라 달라집니다.
      <br class="hidden md:block"/> nuvio에서는 기본형 홈페이지는 약 200만원부터,
      <br class="hidden md:block"/> 브랜드 아이덴티티와 사용자 경험(UX)을 반영한 기업형 홈페이지는 400~800만원대에서 진행되는 경우가 많습니다.
      <br/> <br/> 정확한 금액은 구성과 기능 범위에 따라 조정되며,
      <br class="hidden md:block"/> 예산이 확정되지 않았더라도 부담 없이 문의해 주세요.
      <br class="hidden md:block"/> 간단한 프로젝트 정보만 공유해 주시면, 합리적인 견적과 진행 방향을 빠르게 안내드리겠습니다.`,
    },
    {
      category: "제작·견적",
      question: "홈페이지 제작 기간은 얼마나 걸리나요?",
      answer: `일반적으로 2~4주 정도 소요됩니다. 디자인의 복잡도나 페이지 수,
        <br class="hidden md:block"/>추가 기능 여부에 따라 달라집니다. 일정에 맞춰 단계별 진행 일정을 안내드립니다.`,
    },
    {
      category: "제작·견적",
      question: "어떤 정보를 제공해야 정확한 견적이 가능한가요?",
      answer: `
          보다 정확한 견적 안내를 위해서는 몇 가지 정보를 함께 알려주시면 좋습니다.
          <br/><br/>
          홈페이지의 목적, 예상 메뉴 구성, 참고하시는 사이트, 필요 기능, 예산 범위 등을 공유해 주시면 프로젝트의 방향과 규모에 맞는 현실적인 견적을 빠르게 안내드릴 수 있습니다.
        `,
    },
    {
      category: "제작·견적",
      question: "자료가 부족해도 제작이 가능한가요?",
      answer: `
          꼭 기획안이나 완성된 자료가 없어도 괜찮습니다.<br class="hidden md:block"/>
          초기 기획이 없는 경우에도 nuvio에서 전반적인 사이트 구조와 흐름을 함께 설계하며,<br class="hidden md:block"/>
          브랜드 방향에 맞춘 간단한 기획 컨설팅을 제공합니다.

          <br /><br />

          필요한 콘텐츠(이미지, 문구)가 부족하다면 기획 단계에서 구성과 문안을 함께 도와드립니다.
        `,
    },
    {
      category: "제작·견적",
      question: "예산이 정해져 있어도 제작이 가능한가요?",
      answer: `
          네, 가능합니다. 예산 범위에 맞춰 구성과 기능을 조정하여,<br class="hidden md:block"/>
          브랜드에 가장 적합한 방향으로 최적의 결과물을 제안드립니다.
      `,
    },
    {
      category: "제작·견적",
      question: "급하게 오픈해야 하는데 단기 제작도 가능한가요?",
      answer:
        "네. 콘텐츠 및 콘셉트가 명확할 경우 평균 5~7일 내 제작 가능합니다.",
    },

    // 2️⃣ 기능·기술
    {
      category: "기능·기술",
      question: "관리자가 직접 수정할 수 있나요?",
      answer:
        "네. 게시글 작성, 이미지 교체, 문의 확인 등 기본적인 관리가 가능한 관리자 페이지(CMS)를 함께 제공합니다.<br/><br/>사용법도 간단하게 안내드리며, 필요 시 매뉴얼을 함께 드립니다.",
    },
    {
      category: "기능·기술",
      question: "검색엔진 최적화(SEO)는 기본 포함인가요?",
      answer:
        "네. 기본적인 메타 태그 설정부터 구조화 데이터, 네이버 서치어드바이저, 구글 서치 콘솔 등록까지 지원합니다.<br/><br/>또한 검색 노출을 높일 수 있는 콘텐츠 구성 방향도 함께 제안드립니다.",
    },
    {
      category: "기능·기술",
      question: "반응형으로 제작되나요?",
      answer:
        "네. 모든 홈페이지는 반응형으로 제작되어 PC, 태블릿, 모바일 등 어떤 화면에서도 최적화된 비율로 노출됩니다.",
    },
    {
      category: "기능·기술",
      question: "게시판, 블로그, 포트폴리오 같은 기능도 포함되나요?",
      answer:
        "네. 원하시는 경우 게시판, 블로그, 갤러리, 포트폴리오 등 다양한 기능을 목적에 맞게 함께 구현해드립니다.",
    },
    {
      category: "기능·기술",
      question:
        "기본적인 홈페이지 외에도 쇼핑몰이나 예약 시스템도 연동이 가능한가요?",
      answer:
        "네. 일반 기업형 홈페이지뿐 아니라 쇼핑몰, 예약, 결제, 회원 관리 기능까지 연동이 가능합니다.<br/><br/>프로젝트 목적에 따라 CMS형 구축 또는 맞춤형(커스텀) 개발로 진행해드립니다.",
    },

    // 3️⃣ 운영·관리
    {
      category: "운영·관리",
      question: "유지보수는 어떻게 진행되나요?",
      answer:
        "홈페이지 오픈 후 3개월간은 무상 유지보수를 제공합니다. 이후에는 유상 유지관리 계약을 통해 안정적인 운영을 지원합니다.<br/><br/>버그 수정, 간단한 콘텐츠 변경, 시스템 점검 등 사이트 상태를 주기적으로 확인하며, 필요 시 개선사항을 제안드립니다.",
    },
    {
      category: "운영·관리",
      question: "홈페이지 콘텐츠(텍스트/이미지) 수정은 직접 할 수 있나요?",
      answer:
        "프로젝트의 구조와 목적에 따라 다르지만, 수정이 잦은 영역은 관리자 페이지(CMS)를 통해 직접 수정하실 수 있도록 구성해드립니다.<br/><br/>텍스트 변경, 이미지 교체, 게시글 등록 등은 초보자도 쉽게 사용할 수 있도록 직관적으로 설계합니다.",
    },
    {
      category: "운영·관리",
      question: "오픈 후 오류가 생기면 어떻게 처리하나요?",
      answer:
        "긴급 대응이 필요한 오류는 즉시 확인 후 복구를 진행하며, 유지관리 계약 여부에 따라 우선 지원 체계로 처리됩니다.<br/><br/>서버 문제나 접속 불가 등 긴급 상황 시, 담당자가 직접 원인 분석 및 수정까지 빠르게 대응합니다.",
    },

    {
      category: "운영·관리",
      question: "사이트 수정이나 콘텐츠 업데이트는 어떻게 요청하나요?",
      answer:
        "유지보수 전용 채널(이메일, 카카오톡 등)을 통해 요청하시면 됩니다.<br/><br/>요청 내용은 담당자가 검토 후 작업 일정을 안내드리며, 일반적인 수정 사항은 평균 1~2일 이내 반영됩니다.",
    },
    {
      category: "운영·관리",
      question: "리뉴얼이나 디자인 변경도 맡길 수 있나요?",
      answer:
        "물론 가능합니다. 기존 사이트를 분석하여 브랜드 방향과 트렌드에 맞게 새롭게 리뉴얼합니다.<br/><br/>디자인 개선뿐 아니라, 정보 구조와 사용자 경험(UX)까지 함께 재정비하여 완성도 높은 리뉴얼을 제안드립니다.",
    },

    // 4️⃣ 계약·결제
    {
      category: "계약·결제",
      question: "계약은 어떤 방식으로 체결되나요?",
      answer:
        "nuvio는 주로 전자계약(이메일 계약) 방식으로 진행합니다. 계약서 내용을 상호 검토 후 동의하시면, 전자 서명을 통해 빠르게 체결됩니다.<br/><br/>직접 방문이 필요한 경우 대면 계약도 가능하며, 모든 계약은 프로젝트 범위, 일정, 비용, 유지보수 조건을 명확히 명시하여 진행됩니다.",
    },
    {
      category: "계약·결제",
      question: "결제는 어떤 방식으로 진행되나요?",
      answer:
        "일반적으로 계약 시 50% 선금, 최종 완료 후 50% 잔금 방식으로 진행됩니다.<br/><br/>단, 고객사의 내부 규정이나 정산 절차가 있는 경우에는 협의 후 일정 조정이 가능합니다. 모든 결제 내역은 세금계산서와 함께 투명하게 관리됩니다.",
    },
    {
      category: "계약·결제",
      question: "세금계산서 발행이 가능한가요?",
      answer:
        "네, 가능합니다. 사업자등록증을 보내주시면 전자세금계산서를 발행해드립니다.",
    },
    {
      category: "계약·결제",
      question: "제작 도중 프로젝트를 취소하면 환불이 가능한가요?",
      answer: `환불은 진행 단계에 따라 차이가 있습니다.<br/><br/>기획 및 디자인 시안이 시작되기 전에는 전액 환불이 가능하며,<br class="hidden md:block"/> 이후에는 이미 진행된 작업 범위에 따라 일부 비용이 공제됩니다.<br/><br/>구체적인 환불 기준은 프로젝트 계약서에 명시되어 있으며, 계약 전 모든 내용을 충분히 안내드립니다.`,
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
                  "px-[30px] py-[15px] text-[28px] md:text-[18px] rounded-[9999px] border transition-all cursor-pointer font-semibold border-2 rotate-x-up",
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
                <div
                  className="px-[20px] py-[25px] md:py-[18px] text-white/70 text-[30px] md:text-[20px] border border-white/5 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
