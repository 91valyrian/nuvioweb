"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LandingPortfolioSection from "@/components/LandingPortfolioSection";

gsap.registerPlugin(ScrollTrigger);

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://nuvio-web.com";

export default function LandingPage() {
  const navbarRef = useRef(null);
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 기존 ScrollTrigger 모두 제거
    ScrollTrigger.getAll().forEach((st) => st.kill());

    // 앵커 링크 스무스 스크롤 처리 (이벤트 위임)
    const handleAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault();
          const navbarHeight = navbarRef.current?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - navbarHeight - 20; // 20px 여유 공간

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    };

    // document에 이벤트 위임으로 한 번만 리스너 추가
    document.addEventListener("click", handleAnchorClick);

    const initAnimations = () => {
      // 초기 상태 설정: 모든 애니메이션 요소를 초기 상태로 설정
      gsap.set(".hero-anim", { y: 10, opacity: 0 });
      gsap.set(".glass-card", { y: 40, opacity: 0 });
      gsap.set(".scroll-anim", { y: 30, opacity: 0 });
      gsap.set(".contact-anim", { y: 10, opacity: 0 });

      // Hero Section Animation (즉시 실행)
      const heroElements = gsap.utils.toArray(".hero-anim");
      heroElements.forEach((el, index) => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: index * 0.15,
          ease: "power3.out",
        });
      });

      // Card animations
      gsap.utils.toArray(".glass-card").forEach((card) => {
        if (!card.closest("#section-hero")) {
          gsap.fromTo(
            card,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 95%",
                toggleActions: "play none none none",
                once: true, // 한 번만 실행
              },
            }
          );
        }
      });

      // Scroll animations
      gsap.utils.toArray(".scroll-anim").forEach((elem) => {
        if (elem.classList.contains("glass-card")) return;
        gsap.fromTo(
          elem,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true, // 한 번만 실행
            },
          }
        );
      });

      // Contact form animation
      const contactAnim = document.querySelector(".contact-anim");
      if (contactAnim) {
        gsap.fromTo(
          contactAnim,
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#section-consult",
              start: "top 75%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }

      // 현재 스크롤 위치에서 이미 보이는 요소들 즉시 표시
      const checkVisibleElements = () => {
        const allElements = [
          ...gsap.utils.toArray(".glass-card"),
          ...gsap.utils.toArray(".scroll-anim"),
        ];

        allElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.95;
          if (isVisible && el.style.opacity === "0") {
            gsap.set(el, { opacity: 1, y: 0 });
          }
        });

        const contactEl = document.querySelector(".contact-anim");
        if (contactEl) {
          const rect = contactEl.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.75;
          if (isVisible && contactEl.style.opacity === "0") {
            gsap.set(contactEl, { opacity: 1, y: 0 });
          }
        }
      };

      // 초기 체크 및 스크롤 이벤트 리스너
      setTimeout(() => {
        checkVisibleElements();
        ScrollTrigger.refresh();
      }, 100);
    };

    // Navbar scroll effect
    const handleScroll = () => {
      if (navbarRef.current) {
        if (window.scrollY > 20) {
          navbarRef.current.classList.add("bg-[#1a1a2e]/95", "shadow-lg");
          navbarRef.current.classList.remove("bg-[#1a1a2e]/80");
        } else {
          navbarRef.current.classList.add("bg-[#1a1a2e]/80");
          navbarRef.current.classList.remove("bg-[#1a1a2e]/95", "shadow-lg");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // 약간의 지연 후 애니메이션 초기화 (DOM이 완전히 렌더링된 후)
    const timer = setTimeout(() => {
      initAnimations();
    }, 50);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      // 앵커 링크 이벤트 리스너 제거
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [pathname]); // pathname 변경 시 재실행

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      url: formData.get("url") || "없음",
      budget: formData.get("budget"),
      message: formData.get("message"),
      services: ["홈페이지 제작"],
      consent: true,
    };

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(
          "무료 진단 신청이 완료되었습니다. 25년차 전문가가 직접 분석해 24시간 내로 연락드리겠습니다."
        );
        form.reset();
      } else {
        alert("전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } catch (err) {
      alert("네트워크 오류가 발생했습니다. 연결 상태를 확인해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#1a1a2e] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav
        ref={navbarRef}
        className="fixed top-0 w-full z-50 bg-[#1a1a2e]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300"
        id="navbar"
      >
        <div className="container md:h-20 h-32 flex items-center justify-between">
          <Link href="/" className="">
            <Image
              src="/logo/logo.svg"
              alt="NUVIO"
              width={85.6}
              height={26}
              className="w-[154px] md:w-[85px] h-auto"
              priority
            />
          </Link>
          <a
            href="#section-consult"
            className="inline-flex items-center justify-center px-6 py-2.5 border border-white/20 text-[28px] md:text-[16px] font-medium rounded-[9999px] text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            무료 진단 신청
          </a>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section
        id="section-hero"
        className="relative min-h-[1300px] md:min-h-screen flex items-center justify-center pt-20 overflow-hidden py-[200px] md:py-[150px]"
      >
        {/* 그리드 패턴 배경 - 덜 촘촘하게 */}
        <div
          className="absolute inset-0 z-[0] opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            backgroundPosition: "0 0",
          }}
        />

        {/* 배경 조명 효과 - 기존 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366f1]/20 rounded-[9999px] blur-[100px] z-[1] animate-pulse" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8b5cf6]/10 rounded-[9999px] blur-[80px] z-[1]" />

        {/* 왼쪽 하단 큰 퍼플 글로우 - 이미지 참고 */}
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-radial from-[#a78bfa]/40 via-[#c4b5fd]/25 to-transparent rounded-[9999px] blur-[150px] z-[1] animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.4) 0%, rgba(196,181,253,0.25) 30%, transparent 70%)",
          }}
        />

        {/* 오른쪽 상단 큰 퍼플 글로우 - 이미지 참고 */}
        <div
          className="absolute top-[5%] right-[-5%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-gradient-radial from-[#8b5cf6]/35 via-[#a78bfa]/20 to-transparent rounded-[9999px] blur-[120px] z-[1]"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.35) 0%, rgba(167,139,250,0.2) 40%, transparent 70%)",
          }}
        />

        <div className="container text-center z-10">
          <div className="hero-anim opacity-0 translate-y-10 mb-8">
            <span className="text-[#a78bfa] font-bold text-[28px] md:text-[16px] tracking-wider uppercase">
              Overview
            </span>
          </div>

          <h1 className="hero-anim opacity-0 translate-y-10 text-[64px] md:text-[48px] lg:text-[72px] font-bold leading-tight mb-8 break-keep text-white">
            홈페이지, <span className="text-[#a78bfa]">90%</span>는
            <br />
            <span className="text-[#a78bfa]">돈만 쓰고 버려집니다.</span>
          </h1>

          <p className="hero-anim opacity-0 translate-y-10 text-[32px] md:text-[22px] text-white/80 mb-6 max-w-3xl mx-auto leading-relaxed break-keep">
            예쁜 디자인이 매출을 만들어주지 않습니다.
            <br />
            누비오는 얼굴마담이 아닌,
            <br className="md:hidden block" />
            <strong className="text-white font-semibold">
              실적을 내는 영업사원
            </strong>
            을 만듭니다.
          </p>

          <div className="hero-anim opacity-0 translate-y-10 flex flex-col md:flex-row gap-4 justify-center items-center">
            <a
              href="#section-consult"
              className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-[30px] md:text-[18px] font-bold rounded-[9999px] transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transform hover:-translate-y-1"
            >
              내 홈페이지 무료 진단하기
            </a>
            <a
              href="#section-stats"
              className="w-full md:w-auto px-10 py-4 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white/70 hover:text-white text-[30px] md:text-[18px] font-medium rounded-[9999px] transition-all duration-300"
            >
              왜 실패하는지 확인하기
            </a>
          </div>
        </div>

        {/* 하단 스크롤 유도 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-white/50 opacity-50">
          <span className="text-[26px] md:text-[14px] mb-2">Scroll Down</span>
          <svg
            className="md:w-6 md:h-6 w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* 2. Market Research Section */}
      <section
        id="section-stats"
        className="bg-[#0f0f1e] py-[150px] md:py-[100px] relative"
      >
        <div className="container">
          <div className="mb-12 scroll-anim">
            <p className="text-[#a78bfa] font-bold text-[28px] md:text-[16px] tracking-wider uppercase mb-4">
              Market Research
            </p>
            <h2 className="text-[54px] md:text-[44px] font-bold leading-tight text-white">
              대부분의 사업자 홈페이지가
              <br />
              <span className="text-[#a78bfa]">문의가 없는 이유</span>를
              분석했습니다.
            </h2>
            <p className="text-white/50 mt-4 text-[28px] md:text-[18px]">
              자체 조사 대상: 최근{" "}
              <span className="text-[#a78bfa] font-bold">2년</span> 내 제작된
              중소사업자 웹사이트{" "}
              <span className="text-[#a78bfa] font-bold">200개</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                num: 1,
                category: "Mobile Usability",
                title: "모바일 가독성 엉망",
                desc: "PC만 고려하여 모바일에서 글씨가 작거나 버튼 터치가 안 됨.",
                label: "부적합 판정",
                value: 82.4,
              },
              {
                num: 2,
                category: "No Call to Action",
                title: "문의 버튼 찾기 힘듦",
                desc: "고객이 연락하고 싶어도 전화번호나 상담 버튼이 숨겨져 있음.",
                label: "이탈률 증가",
                value: 65.8,
              },
              {
                num: 3,
                category: "Slow Performance",
                title: "로딩 속도 3초 이상",
                desc: "최적화 안 된 고용량 이미지 사용으로 접속 즉시 고객 이탈.",
                label: "고객 손실",
                value: 47.2,
              },
              {
                num: 4,
                category: "SEO Failure",
                title: "검색 결과 노출 실패",
                desc: "사이트 제목이 'Home'으로 되어있어 네이버/구글에서 검색 안 됨.",
                label: "노출 실패",
                value: 91.5,
              },
              {
                num: 5,
                category: "Security Risk",
                title: "보안 경고 메시지",
                desc: "SSL 미설치로 '주의 요함' 문구가 떠서 고객 신뢰도 추락.",
                label: "신뢰 하락",
                value: 76.3,
              },
              {
                num: 6,
                category: "Complex UX",
                title: "복잡한 메뉴 구조",
                desc: "고객이 원하는 정보를 찾지 못해 10초 안에 뒤로가기 버튼 클릭.",
                label: "방문자 이탈",
                value: 58.9,
              },
            ].map((stat) => (
              <div
                key={stat.num}
                className="glass-card bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl relative overflow-hidden group"
              >
                {/* <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#6366f1] to-[#8b5cf6]" /> */}
                <div className="flex justify-between items-center mb-8">
                  <span className="md:w-8 md:h-8 w-12 h-12 rounded-[9999px] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-[26px] md:text-[14px] font-bold text-white shadow-lg shadow-[#6366f1]/30">
                    {stat.num}
                  </span>
                  <span className="text-[24px] md:text-[14px] font-medium text-[#a78bfa]/60 uppercase">
                    {stat.category}
                  </span>
                </div>
                <h3 className="text-[34px] md:text-[24px] font-bold text-white mb-4">
                  {stat.title}
                </h3>
                <p className="text-white/60 text-[28px] md:text-[16px] mb-8">
                  {stat.desc}
                </p>
                <div className="relative pt-4">
                  <div className="flex justify-between text-[26px] md:text-[14px] mb-4 font-bold">
                    <span className="text-white">{stat.label}</span>
                    <span className="text-[#a78bfa]">{stat.value}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-[9999px] md:h-2 h-4">
                    <div
                      className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] md:h-2 h-4 rounded-[9999px] transition-all duration-1000"
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Pain Points Interview */}
      <section className="py-[150px] md:py-[100px] bg-[#1a1a2e] border-t border-white/5">
        <div className="container">
          <div className="text-center mb-16 scroll-anim">
            <span className="text-[#a78bfa] font-bold tracking-wider uppercase text-[28px] md:text-[16px]">
              Interview
            </span>
            <h2 className="text-[54px] md:text-[44px] font-bold mt-4 leading-tight text-white">
              사장님들은 <span className="text-[#a78bfa]">어떤 점</span>이
              답답해서
              <br />
              <span className="text-[#a78bfa]">리뉴얼을 결심</span>했을까요?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                tag: "50대 제조기업 대표",
                quote:
                  "큰 맘 먹고 비싸게 만들었는데, 거래처에서 홈페이지가 왜 이렇게 느리냐고 핀잔을 줬습니다. 창피해서 명함에 주소도 못 넣겠어요.",
                highlight: "거래처에서 홈페이지가 왜 이렇게 느리냐고",
                name: "김OO 대표님",
                role: "금속 가공업",
                icon: "👷‍♂️",
              },
              {
                tag: "40대 전문직",
                quote:
                  "블로그 보고 연락 오는 사람은 있는데, 홈페이지 보고 연락 오는 사람은 1년에 한 명도 없었어요. 그냥 장식품이었습니다.",
                highlight: "1년에 한 명도 없었어요",
                name: "박OO 변호사님",
                role: "법률 사무소",
                icon: "⚖️",
              },
              {
                tag: "60대 유통업",
                quote:
                  "아들이 스마트폰으로 우리 회사 검색해 보더니, 화면이 다 깨져서 보인다고 하더군요. 그걸 3년 동안 모르고 있었습니다.",
                highlight: "화면이 다 깨져서 보인다고",
                name: "이OO 대표님",
                role: "식자재 유통",
                icon: "📦",
              },
              {
                tag: "40대 요식업",
                quote:
                  "홈페이지에 메뉴 사진이 모바일에서 너무 작게 보이고, 가격 정보도 제대로 안 보여요. 손님들이 전화로 계속 물어봐서 업무가 두 배가 됐습니다.",
                highlight: "손님들이 전화로 계속 물어봐서",
                name: "최OO 점주님",
                role: "프랜차이즈 식당",
                icon: "🍳",
              },
              {
                tag: "50대 교육업",
                quote:
                  "학부모님들은 다 폰으로 보는데, 우리 학원 홈페이지는 PC용이라 커리큘럼 글씨가 콩알만 해요. 상담 문의가 뚝 끊겼습니다.",
                highlight: "커리큘럼 글씨가 콩알만 해요",
                name: "정OO 원장님",
                role: "입시 학원",
                icon: "📚",
              },
              {
                tag: "30대 쇼핑몰",
                quote:
                  "상세페이지 로딩이 너무 느려서 고객들이 결제하기도 전에 다 나가버려요. 광고비만 날리고 있습니다.",
                highlight: "결제하기도 전에 다 나가버려요",
                name: "강OO 대표님",
                role: "의류 쇼핑몰",
                icon: "🛒",
              },
            ].map((interview, idx) => (
              <div
                key={idx}
                className="glass-card bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-[#6366f1]/50 transition-colors"
              >
                <div className="mb-6">
                  <div className="bg-[#6366f1]/10 text-[#a78bfa] md:px-3 md:py-1 py-2 px-4 rounded inline-block text-[26px] md:text-[14px] font-bold mb-3">
                    {interview.tag}
                  </div>
                  <div className="bg-white/5 md:p-4 p-6 rounded-xl rounded-tl-none border border-white/5 relative">
                    <p className="text-white leading-relaxed text-[28px] md:text-[16px]">
                      {interview.quote.split(interview.highlight || "")[0]}
                      {interview.highlight && (
                        <span className="text-[#a78bfa] font-bold">
                          {interview.highlight}
                        </span>
                      )}
                      {interview.quote.split(interview.highlight || "")[1]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center mt-2 opacity-70">
                  <div className="md:w-10 md:h-10 w-20 h-20 rounded-[9999px] bg-white/10 flex items-center justify-center text-[36px] md:text-lg">
                    {interview.icon}
                  </div>
                  <div className="ml-3">
                    <p className="text-[28px] md:text-[16px] font-bold text-white">
                      {interview.name}
                    </p>
                    <p className="text-[24px] md:text-[14px] text-white/60">
                      {interview.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center scroll-anim">
            <a
              href="#section-solution"
              className="text-white/60 hover:text-white underline underline-offset-4 transition-colors text-[30px] md:text-[18px]"
            >
              그렇다면, 누비오는 무엇이 다를까요? ↓
            </a>
          </div>
        </div>
      </section>

      {/* 4. Solution Section */}
      <section
        id="section-solution"
        className="py-[150px] md:py-[100px] bg-[#0f0f1e] relative overflow-hidden"
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6366f1]/5 rounded-[9999px] blur-[120px] -z-0" />

        <div className="container relative z-10">
          <div className="text-center mb-20 scroll-anim">
            <span className="text-[#a78bfa] font-bold tracking-wider uppercase text-[28px] md:text-[16px]">
              Our Solution
            </span>
            <h2 className="text-[64px] md:text-[48px] font-bold mt-2 mb-6 text-white">
              결과를 만드는 <span className="text-[#a78bfa]">3단계 공식</span>
            </h2>
            <p className="text-white/60 text-[30px] md:text-[20px]">
              예쁜 쓰레기를 만들지 않습니다.{" "}
              <span className="text-[#a78bfa] font-bold">철저한 기획</span>으로
              승부합니다.
            </p>
          </div>

          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
            {[
              {
                step: 1,
                title: "사업 분석 및\n전략 기획",
                highlight: "전략 기획",
                desc: "경쟁사가 누구인지, 타겟 고객이 무엇을 원하는지 분석합니다. 디자인 전에 '무엇을 팔 것인가'를 먼저 정의합니다.",
              },
              {
                step: 2,
                title: "설득의 심리학\n카피라이팅",
                highlight: "카피라이팅",
                desc: '"저희 회사는..."으로 시작하는 지루한 소개는 뺍니다. 고객이 듣고 싶어 하는 혜택과 해결책 중심으로 문구를 작성합니다.',
              },
              {
                step: 3,
                title: "전환 최적화\n디자인 & 개발",
                highlight: "디자인 & 개발",
                desc: "화려함보다는 신뢰감을, 복잡함보다는 명확함을 추구합니다. 문의 버튼을 누를 수밖에 없는 동선을 설계합니다.",
              },
            ].map((item, idx) => (
              <div
                key={item.step}
                className={`glass-card bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 ${
                  idx === 1 ? "md:mt-12" : idx === 2 ? "md:mt-24" : ""
                }`}
              >
                <div className="md:w-14 md:h-14 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-[32px] md:text-2xl font-bold text-white mb-6 shadow-lg shadow-[#6366f1]/50 ring-2 ring-[#a78bfa]/30">
                  {item.step}
                </div>
                <h3 className="text-[36px] md:text-[24px] font-bold text-white mb-4 whitespace-pre-line">
                  {item.title.split(item.highlight)[0]}
                  <span className="text-[#a78bfa]">{item.highlight}</span>
                </h3>
                <p className="text-white/60 leading-relaxed text-[28px] md:text-[16px]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Recommend Section */}
      <section
        id="section-recommend"
        className="py-[150px] md:py-[100px] relative overflow-hidden bg-[#1a1a2e] border-t border-white/5"
      >
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="scroll-anim">
              <span className="text-[#a78bfa] font-bold tracking-wider uppercase text-[28px] md:text-[16px] mb-2 block">
                Recommendation
              </span>
              <h2 className="text-[64px] md:text-[48px] font-bold leading-tight mb-6 text-white">
                이런 분들께 <span className="text-[#a78bfa]">누비오</span>를
                <br />
                <span className="text-[#a78bfa]">강력하게</span> 추천합니다.
              </h2>
              <p className="text-white/60 text-[30px] md:text-[20px] mb-8 leading-relaxed">
                저희는 단순히 <span className="text-white/80">예쁜 그림</span>을
                그리는 회사가 아닙니다.
                <br />
                <span className="text-[#a78bfa] font-bold">
                  사업의 성장을 돕는 파트너
                </span>
                가 필요한 분들과 일합니다.
              </p>
              <a
                href="#section-consult"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-[30px] md:text-[20px] font-bold rounded-[9999px] shadow-lg shadow-[#6366f1]/30 hover:shadow-[#6366f1]/50 transition-all transform hover:-translate-y-1"
              >
                무료 진단 신청하기
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

            <div className="grid gap-4">
              {[
                {
                  title: "기업 홈페이지가 필요하신 분",
                  desc: "회사 소개와 신뢰도 향상을 위한 전문적인 웹사이트가 필요하신 경우",
                },
                {
                  title: "온라인 사업을 시작하시는 분",
                  desc: "온라인 판매나 서비스 제공을 위한 플랫폼이 필요하신 경우",
                },
                {
                  title: "홈페이지 리뉴얼을 고민하시는 분",
                  desc: "오래된 홈페이지를 현대적으로 개선하고 싶으신 경우",
                },
                {
                  title: "모바일 최적화가 필요하신 분",
                  desc: "모바일 환경에서도 완벽하게 작동하는 반응형 웹사이트가 필요한 경우",
                },
                {
                  title: "마케팅 효과를 높이고 싶으신 분",
                  desc: "고객 유입과 전환율을 높일 수 있는 전략적 웹사이트가 필요한 경우",
                },
                {
                  title: "장기적인 파트너를 찾으시는 분",
                  desc: "제작 후에도 지속적인 관리와 지원이 필요하신 경우",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-start hover:border-[#6366f1]/50 transition-colors"
                >
                  <div className="flex-shrink-0 md:w-8 md:h-8 w-12 h-12 rounded-[9999px] bg-gradient-to-br from-[#6366f1]/30 to-[#8b5cf6]/30 text-[#a78bfa] flex items-center justify-center mt-1 ring-2 ring-[#a78bfa]/20">
                    <svg
                      className="md:w-5 md:h-5 w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-[34px] md:text-[20px] font-bold text-white">
                      {item.title}
                    </h4>
                    <p className="text-white/60 mt-1 text-[26px] md:text-[16px]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Portfolio Section */}
      <LandingPortfolioSection />

      {/* 7. Contact Section */}
      <section
        id="section-consult"
        className="py-[150px] md:py-[100px] bg-[#0f0f1e] relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-[#6366f1]/5 blur-[100px] pointer-events-none" />

        <div className="container max-w-4xl relative z-10">
          <div className="glass-card bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl px-8 py-14 md:p-14 shadow-2xl contact-anim opacity-0 translate-y-10">
            <div className="text-center mb-10">
              <span className="bg-white/10 text-white px-3 py-1 rounded-[9999px] text-[28px] md:text-[16px] font-bold mb-4 inline-block">
                25년차 전문가 무료 진단
              </span>
              <h2 className="text-[54px] md:text-[44px] font-bold text-white mb-6 leading-tight">
                지금 홈페이지 상태를{" "}
                <span className="text-[#a78bfa]">진단받고</span>
                <br />
                <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
                  매출을 만드는 홈페이지
                </span>
                로 전환하세요.
              </h2>
              <p className="text-white/70 text-[30px] md:text-[20px]">
                <span className="text-[#a78bfa] font-bold">25년 경력</span>의
                전문가가 직접 진단해드립니다.
                <br className="hidden md:block" />
                진단 결과를 바탕으로{" "}
                <span className="text-[#a78bfa] font-bold">
                  기획부터 최적화까지
                </span>{" "}
                한 팀이 책임집니다.
                <br className="hidden md:block" />
                부담 없이 신청하세요. 영업 전화가 아닌{" "}
                <span className="text-[#a78bfa] font-bold">
                  &apos;해결책&apos;
                </span>
                을 드립니다.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label
                    htmlFor="name"
                    className="block text-[28px] md:text-[16px] font-bold text-white/60 mb-2 group-focus-within:text-[#a78bfa] transition-colors"
                  >
                    성함 / 직함
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-white/5 text-[28px] md:text-[16px]  border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
                    placeholder="예: 홍길동 대표"
                  />
                </div>
                <div className="group">
                  <label
                    htmlFor="phone"
                    className="block text-[28px] md:text-[16px] font-bold text-white/60 mb-2 group-focus-within:text-[#a78bfa] transition-colors"
                  >
                    연락처
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full bg-white/5 text-[28px] md:text-[16px] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
                    placeholder="예: 010-0000-0000"
                  />
                </div>
              </div>
              <div className="group">
                <label
                  htmlFor="url"
                  className="block text-[28px] md:text-[16px] font-bold text-white/60 mb-2 group-focus-within:text-[#a78bfa] transition-colors"
                >
                  홈페이지 주소 (없으시면 &apos;없음&apos; 기재)
                </label>
                <input
                  type="text"
                  id="url"
                  name="url"
                  className="w-full bg-white/5 text-[28px] md:text-[16px] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
                  placeholder="예: www.mycompany.com"
                />
              </div>
              <div className="group">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6 mb-4">
                  <label className="text-[28px] md:text-[16px] font-bold text-white/60 whitespace-nowrap">
                    프로젝트 예산을 선택해주세요.
                  </label>
                  <div className="grid grid-cols-3 gap-3 md:gap-4 flex-1">
                    {[
                      "100만원 이하",
                      "200만원 이하",
                      "300만원 이하",
                      "500만원 이하",
                      "1,000만원 이하",
                      "5,000만원 이하",
                    ].map((budget) => (
                      <label key={budget} className="relative cursor-pointer">
                        <input
                          type="radio"
                          name="budget"
                          value={budget}
                          required
                          className="peer sr-only"
                        />
                        <div className="w-full border border-white/20 rounded-xl px-3 py-3 md:px-4 md:py-4 text-center text-white text-[20px] md:text-[16px] font-medium bg-transparent peer-checked:bg-[#6366f1] peer-checked:border-[#6366f1] peer-checked:text-white transition-all duration-300 hover:border-[#6366f1]/50">
                          {budget}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="group">
                <label
                  htmlFor="message"
                  className="block text-[28px] md:text-[16px] font-bold text-white/60 mb-2 group-focus-within:text-[#a78bfa] transition-colors"
                >
                  가장 큰 고민거리는 무엇인가요?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  className="w-full bg-white/5 text-[28px] md:text-[16px] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-main focus:ring-1 focus:ring-main transition-all"
                  placeholder="예: 홈페이지가 너무 옛날 느낌이라 바꾸고 싶어요. 문의가 안 들어와요."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold text-[32px] md:text-[24px] py-5 rounded-xl shadow-lg shadow-[#6366f1]/30 hover:shadow-[#6366f1]/50 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-6 w-6 md:h-5 md:w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        발송 중입니다...
                      </>
                    ) : (
                      "무료 진단 신청하기"
                    )}
                  </span>
                  {!isSubmitting && (
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  )}
                </button>
                <p className="text-center text-white/50 text-[26px] md:text-[14px] mt-4 flex items-center justify-center gap-1">
                  <svg
                    className="md:w-4 md:h-4 w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  작성하신 정보는 상담 목적으로만 안전하게 사용됩니다.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#0a0a14] to-black py-20 md:py-16 border-t border-white/10 relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-[10%] w-[300px] h-[300px] bg-[#6366f1]/20 rounded-[9999px] blur-[100px]" />
          <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-[#8b5cf6]/20 rounded-[9999px] blur-[120px]" />
        </div>

        <div className="container relative z-10">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* 브랜드 섹션 */}
            <div className="scroll-anim">
              <div className="mb-6">
                <span className="text-[40px] md:text-[32px] font-black text-white mb-4 inline-block">
                  nuvio.
                </span>
                <p className="text-white/70 text-[24px] md:text-[18px] mt-4 leading-relaxed">
                  예쁜 홈페이지가 아닌
                  <br />
                  <span className="text-[#a78bfa] font-bold">
                    매출을 만드는
                  </span>{" "}
                  홈페이지를 만듭니다.
                </p>
              </div>
            </div>

            {/* 연락처 섹션 */}
            <div className="scroll-anim">
              <h3 className="text-[#a78bfa] font-bold text-[24px] md:text-[18px] mb-6 uppercase tracking-wider">
                Contact
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 md:w-5 md:h-5 text-[#a78bfa] mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-white/70 text-[24px] md:text-[16px]">
                    서울시 중구 왕십리로 393-1 202호
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 md:w-5 md:h-5 text-[#a78bfa] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <a
                    href="tel:010-9928-6110"
                    className="text-white/70 hover:text-[#a78bfa] text-[24px] md:text-[16px] transition-colors"
                  >
                    010-9928-6110
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 md:w-5 md:h-5 text-[#a78bfa] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href="mailto:nuvio@naver.com"
                    className="text-white/70 hover:text-[#a78bfa] text-[24px] md:text-[16px] transition-colors"
                  >
                    nuvio@naver.com
                  </a>
                </div>
              </div>
            </div>

            {/* 정보 섹션 */}
            <div className="scroll-anim">
              <h3 className="text-[#a78bfa] font-bold text-[24px] md:text-[18px] mb-6 uppercase tracking-wider">
                Company Info
              </h3>
              <div className="space-y-2">
                <p className="text-white/60 text-[22px] md:text-[16px]">
                  사업자등록번호:{" "}
                  <span className="text-white/80">607-31-05853</span>
                </p>
                <p className="text-white/60 text-[22px] md:text-[16px]">
                  대표: <span className="text-white/80">이형석</span>
                </p>
              </div>
            </div>
          </div>

          {/* 하단 구분선 및 저작권 */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/50 text-[22px] md:text-[14px]">
                &copy; 2026 nuvio Agency. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-[20px] md:text-[12px]">
                  Made with
                </span>
                <span className="text-[#a78bfa] text-xl">♥</span>
                <span className="text-white/40 text-[20px] md:text-[12px]">
                  by nuvio
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 퀵 전환 버튼 - 하단 고정 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 md:p-6 pointer-events-none">
        <a
          href="#section-consult"
          className="group relative px-8 py-5 md:px-12 md:py-6 bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a78bfa] text-white font-black text-[28px] md:text-[24px] rounded-[9999px] shadow-2xl transform transition-all duration-300 hover:scale-110 pointer-events-auto animate-sparkle animate-float"
        >
          {/* 반짝이는 효과 */}
          <div className="absolute inset-0 rounded-[9999px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          </div>

          {/* 텍스트 */}
          <span className="relative z-10 flex items-center gap-3 whitespace-nowrap">
            <span className="text-[32px] md:text-[28px] animate-bounce">
              🔥
            </span>
            <span>홈페이지 문의 안 들어와요? 지금 바로 해결받기</span>
            <span
              className="text-[32px] md:text-[28px] animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              🔥
            </span>
          </span>

          {/* 글로우 효과 */}
          <div className="absolute inset-0 rounded-[9999px] bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a78bfa] opacity-75 blur-xl -z-10 animate-pulse" />
        </a>
      </div>
    </main>
  );
}
