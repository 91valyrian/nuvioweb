"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Modal from "@/components/Modal";

gsap.registerPlugin(ScrollTrigger);

/* 랜딩 전용 에셋: public/landing/ 폴더에 아래 파일들을 넣어주세요.
   (원본: Desktop/00. 작업/00. Nuvio/resource/테스트/ 에서 복사)
   - all_menu.svg, clarity_arrow-line.svg, lets-icons_check-fill.svg
   - gradient-bg01.webp, benefit02.png, benefit03.png, benefit04.png
   - benefit02-bg.png, reviews-bg.png, inquiry-bg.png
   - textmodify.mp4
   - streamline-freehand-*.svg (아이콘들)
*/
const ASSET = (path) => `/landing/${path}`;

export default function LandingPage() {
  const [gnbOpen, setGnbOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [quotePopupVisible, setQuotePopupVisible] = useState(false);
  const quotePopupClosedRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionVisibilityRef = useRef({});
  const [portfolioWorks, setPortfolioWorks] = useState([]);
  const [selectedWork, setSelectedWork] = useState(null);
  const [workDetail, setWorkDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Landing 전용: html 루트 폰트/베이스 사이즈를 16px로 강제, 언마운트 시 복원
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const prevInlineFontSize = root.style.fontSize;
    const prevBaseSize = root.style.getPropertyValue("--base-size");

    root.style.fontSize = "16px";
    root.style.setProperty("--base-size", "16px");

    return () => {
      root.style.fontSize = prevInlineFontSize;
      if (prevBaseSize) {
        root.style.setProperty("--base-size", prevBaseSize);
      } else {
        root.style.removeProperty("--base-size");
      }
    };
  }, []);

  // Smooth scroll for anchor links
  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute("href");
      if (href && href.length > 1) {
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // GSAP: soft-mask, header, common animations, marquee, review marquee, portfolio hover, nav active, quote popup
  useEffect(() => {
    ScrollTrigger.getAll().forEach((st) => st.kill());

    const softMask = document.getElementById("soft-mask");
    const header = document.querySelector(".header-animate");

    if (softMask && header && typeof gsap !== "undefined") {
      gsap.set(softMask, { scale: 0.4, yPercent: 100, opacity: 0 });
      gsap.set(header, { y: -50, opacity: 0 });
      const tl = gsap.timeline();
      tl.to(softMask, {
        scale: 1,
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
      });
      tl.to(
        header,
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      );
    }

    const animationConfigs = {
      fadeUp: { from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 } },
      fadeDown: { from: { opacity: 0, y: -50 }, to: { opacity: 1, y: 0 } },
    };

    ["fadeUp", "fadeDown"].forEach((animType) => {
      const config = animationConfigs[animType];
      const els = document.querySelectorAll(`.${animType}`);
      els.forEach((el) => {
        const duration = parseFloat(el.dataset.duration) || 1.0;
        const delay = parseFloat(el.dataset.delay) || 0;
        const useScroll = el.dataset.scroll === "true";
        const scrollStart = el.dataset.scrollStart || "top 80%";
        const yVal = el.dataset.y ? parseFloat(el.dataset.y) : 50;
        const from = { ...config.from };
        if (animType === "fadeUp" && el.dataset.y) from.y = yVal;
        if (animType === "fadeDown" && el.dataset.y) from.y = -yVal;
        gsap.set(el, from);
        if (useScroll) {
          gsap.to(el, {
            ...config.to,
            duration,
            delay,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: scrollStart, once: true },
          });
        } else {
          gsap.to(el, { ...config.to, duration, delay, ease: "power3.out" });
        }
      });
    });

    // Marquee
    const orangeMarquee = document.querySelector(".marquee-orange-1");
    if (orangeMarquee) {
      const first = orangeMarquee.querySelector(".marquee-text");
      if (first) {
        gsap.to(orangeMarquee, {
          x: -first.offsetWidth,
          duration: 50,
          ease: "none",
          repeat: -1,
        });
      }
    }
    const blueMarquee = document.querySelector(".marquee-blue-1");
    if (blueMarquee) {
      const first = blueMarquee.querySelector(".marquee-text");
      if (first) {
        gsap.set(blueMarquee, { x: 0 });
        gsap.to(blueMarquee, {
          x: -first.offsetWidth,
          duration: 50,
          ease: "none",
          repeat: -1,
        });
      }
    }

    // Review marquee
    const reviewMarquee = document.querySelector(".review-marquee-content");
    if (reviewMarquee) {
      const firstCard = reviewMarquee.querySelector(".review-card");
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const gap = 24;
        const totalWidth = (cardWidth + gap) * 6;
        gsap.to(reviewMarquee, {
          x: -totalWidth,
          duration: 40,
          ease: "none",
          repeat: -1,
        });
      }
    }

    // Portfolio hover은 portfolioWorks 로드 후 별도 effect에서 설정 (아래 useEffect)

    // Nav active state
    const navLinks = document.querySelectorAll(".landing-nav-link");
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.dataset.section === id);
            });
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    const firstSection = sections[0];
    if (firstSection) {
      const firstLink = document.querySelector(
        `.landing-nav-link[data-section="${firstSection.id}"]`
      );
      if (firstLink) firstLink.classList.add("active");
    }

    // Quote scroll popup: show when in cases/benefits/reviews/fee
    const targetIds = ["cases", "benefits", "reviews", "fee"];
    const sectionEls = targetIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const quotePopup = document.getElementById("quoteScrollPopup");
    if (quotePopup && sectionEls.length) {
      const vis = sectionVisibilityRef.current;
      targetIds.forEach((id) => {
        vis[id] = false;
      });
      const check = () => {
        const any = Object.values(vis).some(Boolean);
        if (any && !quotePopupClosedRef.current) {
          setQuotePopupVisible(true);
        } else {
          setQuotePopupVisible(false);
        }
      };
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            vis[e.target.id] = e.isIntersecting;
          });
          check();
        },
        { threshold: 0.1 }
      );
      sectionEls.forEach((el) => io.observe(el));
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const closeGnb = () => setGnbOpen(false);
  const handleInquiryClick = () => {
    const el = document.getElementById("inquiry");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    fetch("/api/works")
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setPortfolioWorks(data))
      .catch(() => setPortfolioWorks([]));
  }, []);

  // 포트폴리오 카드 호버 시 이미지 끝까지 스크롤 모션 (데스크톱, 카드 로드 후)
  useEffect(() => {
    if (portfolioWorks.length === 0 || typeof gsap === "undefined") return;
    const cards = document.querySelectorAll(".landing-portfolio-card");
    const cleanups = [];
    cards.forEach((card) => {
      const shotInner = card.querySelector(".portfolio-shot-inner");
      const img = card.querySelector(".portfolio-img");
      const shot = card.querySelector(".portfolio-shot");
      if (!shotInner || !img || !shot) return;
      const onLoad = () => {
        if (!window.matchMedia("(min-width: 768px)").matches) return;
        const ch = shot.offsetHeight;
        const ih = img.offsetHeight;
        const maxScroll = ih - ch;
        if (maxScroll > 0) {
          const onEnter = () => {
            if (!window.matchMedia("(min-width: 768px)").matches) return;
            gsap.killTweensOf(shotInner);
            gsap.to(shotInner, { y: -maxScroll, duration: 1.6, ease: "power2.out" });
          };
          const onLeave = () => {
            gsap.killTweensOf(shotInner);
            gsap.to(shotInner, { y: 0, duration: 1.2, ease: "power2.out" });
          };
          card.addEventListener("mouseenter", onEnter);
          card.addEventListener("mouseleave", onLeave);
          cleanups.push(() => {
            card.removeEventListener("mouseenter", onEnter);
            card.removeEventListener("mouseleave", onLeave);
          });
        }
      };
      if (img.complete) onLoad();
      else img.addEventListener("load", onLoad);
    });
    return () => cleanups.forEach((fn) => fn());
  }, [portfolioWorks.length]);

  const handleWorkClick = async (work) => {
    setSelectedWork(work);
    setLoadingDetail(true);
    setWorkDetail(null);
    try {
      const res = await fetch(`/api/works/${work.slug}`);
      if (res.ok) setWorkDetail(await res.json());
    } catch (err) {
      console.error("Failed to fetch work detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleClosePortfolioModal = () => {
    setSelectedWork(null);
    setWorkDetail(null);
  };

  // 포트폴리오 모달 열림 시 html/body 스크롤 잠금, 닫히면 복원
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (selectedWork) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [selectedWork]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const planMap = { landing: "랜딩 페이지", basic: "기본 홈페이지 제작", premium: "프리미엄 홈페이지 제작" };
    const plan = planMap[fd.get("plan")] || fd.get("plan");
    const payload = {
      name: fd.get("name"),
      email: "",
      company: fd.get("company"),
      position: "",
      phone: fd.get("phone"),
      url: fd.get("website") || "",
      message: fd.get("inquiry") || "",
      budget: [],
      services: plan ? [plan] : [],
    };
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        alert("문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.");
        form.reset();
      } else {
        alert(data?.error || "전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } catch (err) {
      alert("네트워크 오류가 발생했습니다. 연결 상태를 확인해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="landing-page-root m-0 p-0 w-full min-h-full bg-black overflow-y-auto overflow-x-hidden text-white">
      {/* Header */}
      <header className="header-animate fixed top-5 left-0 w-full h-20 z-20 flex items-center justify-between px-6 md:px-8">
        <div className="text-white text-2xl font-normal tracking-wide">
          <Link href="/">
            <Image
              src="/logo/logo.svg"
              alt="logo"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <nav className="absolute left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-lg rounded-lg xl:flex hidden items-center justify-center gap-8 w-[50rem]">
          {[
            { href: "#solution", section: "solution", label: "솔루션" },
            { href: "#cases", section: "cases", label: "제작 사례" },
            { href: "#benefits", section: "benefits", label: "이용 혜택" },
            { href: "#reviews", section: "reviews", label: "리얼 후기" },
            { href: "#fee", section: "fee", label: "제작 비용" },
            { href: "#inquiry", section: "inquiry", label: "문의하기" },
          ].map((item) => (
            <a
              key={item.section}
              href={item.href}
              data-section={item.section}
              className="landing-nav-link text-white text-[18px] px-4 py-6 font-normal hover:opacity-80 transition-opacity"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="xl:hidden cursor-pointer w-9"
          aria-expanded={gnbOpen}
          aria-controls="gnb-overlay"
          onClick={() => setGnbOpen(true)}
        >
          <Image
            src={ASSET("all_menu.svg")}
            alt="전체 메뉴"
            width={52}
            height={38}
            className="w-9 h-auto"
          />
        </button>
      </header>

      {/* GNB Overlay */}
      <div
        id="gnb-overlay"
        className={`fixed inset-0 z-30 flex flex-col justify-center items-center bg-black/95 backdrop-blur-md transition-all duration-300 ${
          gnbOpen ? "landing-gnb-active opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        style={{ display: gnbOpen ? "flex" : undefined }}
      >
        <button
          type="button"
          className="absolute top-8 right-8 w-8 h-8 text-white text-3xl flex items-center justify-center hover:opacity-80"
          aria-label="메뉴 닫기"
          onClick={closeGnb}
        >
          ×
        </button>
        <nav className="flex flex-col gap-8 items-center">
          {[
            { href: "#solution", section: "solution", label: "솔루션" },
            { href: "#cases", section: "cases", label: "제작 사례" },
            { href: "#benefits", section: "benefits", label: "이용 혜택" },
            { href: "#reviews", section: "reviews", label: "리얼 후기" },
            { href: "#fee", section: "fee", label: "제작 비용" },
            { href: "#inquiry", section: "inquiry", label: "문의하기" },
          ].map((item) => (
            <a
              key={item.section}
              href={item.href}
              data-section={item.section}
              className="text-white text-2xl font-normal no-underline hover:opacity-80 transition-opacity relative"
              onClick={closeGnb}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Hero */}
      <div className="relative w-screen min-h-screen flex justify-center items-start">
        <div className="absolute -top-[20%] w-full h-[80%] blur-[60px] contrast-[1.2] bg-black flex">
          <div className="absolute w-[180vw] h-[160vw] md:w-[100vw] md:h-[100vw] rounded-[9999px] mix-blend-screen opacity-70 -top-[30%] -left-[20%] bg-[radial-gradient(circle,#1F4FFF,transparent)] animate-aurora-1" />
          <div className="absolute w-[180vw] h-[160vw] md:w-[100vw] md:h-[100vw] rounded-[9999px] mix-blend-screen opacity-70 -top-[50%] -left-[40%] bg-[radial-gradient(circle,#220eff,transparent)] animate-aurora-2" />
          <div className="absolute w-[180vw] h-[160vw] md:w-[100vw] md:h-[100vw] rounded-[9999px] mix-blend-screen opacity-70 bottom-[20%] left-[20%] bg-[radial-gradient(circle,#FF2C30,transparent)] animate-aurora-3" />
          <div className="absolute w-[180vw] h-[160vw] md:w-[100vw] md:h-[100vw] rounded-[9999px] mix-blend-screen opacity-70 -top-[20%] left-[60%] bg-[radial-gradient(circle,#FF7C44,transparent)] animate-aurora-4" />
        </div>
        <div
          className="absolute inset-0 opacity-10 z-[5] pointer-events-none"
          style={{
            backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
          }}
        />
        <div
          id="soft-mask"
          className="absolute -bottom-[30%] left-1/2 -translate-x-1/2 xl:w-[120%] w-[1900px] max-w-none h-screen bg-black rounded-tl-[50%_100%] rounded-tr-[50%_100%] z-10 blur-[10px]"
        />
        <div
          id="hero-text-group"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-6 md:px-8 mt-28 md:mt-18 w-full text-center"
        >
          <h1 className="text-white text-[36px] md:text-[56px] font-bold leading-tight fadeUp" data-duration="1.0" data-delay="0.5" data-y="30">
            텍스트 하나 고치는데
            <br />
            아직도 <span className="text-main-2">많은 지출</span>을
            <br className="block md:hidden" /> 하고 계신가요?{" "}
          </h1>
          <p className="text-white text-[18px] md:text-[24px] font-normal mt-7 leading-[130%] fadeUp" data-duration="1.0" data-delay="0.7" data-y="30">
            직접 개발한 강력한 관리자 페이지로
            <br />
            딸깍! 클릭 몇번으로
            <br />
            직접 관리가 가능합니다.
          </p>
          <div className="mt-8 flex md:flex-row flex-col items-center justify-center gap-4">
            <a
              href="#solution"
              className="bg-main-1 text-white text-[16px] md:text-[18px] font-normal inline-flex items-center justify-between md:justify-center gap-5 w-[80%] md:w-auto px-8 md:px-6 py-5 rounded-lg fadeUp"
              data-duration="1.0"
              data-delay="0.9"
              data-y="30"
            >
              <span>무료 상담 신청하기</span>
              <Image src={ASSET("clarity_arrow-line.svg")} alt="arrow" width={24} height={24} />
            </a>
            <a
              href="#cases"
              className="bg-[#222] text-white text-[16px] md:text-[18px] font-normal inline-flex items-center justify-between md:justify-center gap-5 w-[80%] md:w-auto px-8 md:px-6 py-5 rounded-lg fadeUp"
              data-duration="1.0"
              data-delay="1"
              data-y="30"
            >
              <span>포트폴리오 확인하기</span>
              <Image src={ASSET("clarity_arrow-line.svg")} alt="arrow" width={24} height={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Solution */}
      <section
        id="solution"
        className="relative md:py-40 py-28 w-full min-h-0 z-10 bg-black flex flex-col items-center justify-start"
      >
        <div className="px-6 md:px-8 w-full text-center">
          <div
            className="line w-0.5 h-20 mb-6 bg-gradient-to-b from-transparent to-white mx-auto fadeDown"
            data-duration="1.0"
            data-delay="0"
            data-y="30"
            data-scroll="true"
            data-scroll-start="top 80%"
          />
          <h2
            className="text-white text-[32px] md:text-[50px] font-bold leading-tight fadeUp"
            data-duration="1.0"
            data-delay="0.2"
            data-y="30"
            data-scroll="true"
            data-scroll-start="top 80%"
          >
            홈페이지가 없어서
            <br />
            얼마나 많은 기회를
            <br className="block md:hidden" /> 놓치고 계신가요?
          </h2>
          <p
            className="text-white/70 text-[18px] md:text-[24px] font-normal mt-7 leading-[130%] fadeUp"
            data-duration="1.0"
            data-delay="0.4"
            data-y="30"
            data-scroll="true"
            data-scroll-start="top 80%"
          >
            명함은 건네면서, 온라인 명함인<br className="block md:hidden" /> 홈페이지는 없으신가요?
            <br />
            고객은 검색하고, 비교하고,<br className="block md:hidden" /> 결국 신뢰를 선택합니다.
          </p>
          <div className="mt-16">
            <div className="flex flex-wrap justify-center gap-3 max-w-7xl mx-auto">
              {[
                "#유지보수",
                "다른 곳보다 전문성이 떨어져 보여요",
                "#홈페이지 제작",
                "#비용 낭비",
                "#홍보 한계",
                "#이미지 노후",
                "#SEO 부재",
                "#소통 단절",
                "#모바일 에러",
                "인스타엔 새 글인데 홈페이지는 2년 전 소식",
                "#브랜딩 실패",
                "검색해도 안 나오네요?",
                "#기회 상실",
                "광고비는 쓰는데 왜 결제로 안 이어질까?",
                "#브랜드 주권",
                "#업체 연락 두절",
                "#웹 접근성 위반",
                "수정 한 번 하려면 한참 걸리는 답답함",
                "#콘텐츠 부재",
                "연락조차 제대로 안 되는 무책임한 업체",
                "#전문성 의심",
                "누가 왔다 갔는지 알 길이 없네",
                "#24시간 영업 중단",
                "#광고 이탈",
                "#브랜드 첫인상",
              ].map((tag, i) => (
                <span
                  key={tag}
                  className={`fadeUp px-3 md:px-8 py-3 rounded-[9999px] text-[13px] md:text-[20px] ${
                    i === 1
                      ? "bg-gradient-to-r from-main-1 to-main-2 text-white"
                      : i === 9
                        ? "bg-gradient-to-r from-[#E22E31] to-[#1F73B8] text-white"
                        : i === 11
                          ? "bg-gradient-to-r from-[#2EE2AC] to-[#2542D0] text-white"
                          : i === 13
                            ? "bg-gradient-to-r from-[#312EE2] to-[#680D82] text-white"
                            : i === 17
                              ? "bg-gradient-to-r from-[#E22E97] to-[#450D82] text-white"
                              : i === 19
                                ? "bg-gradient-to-r from-[#07C93E] to-[#259CCB] text-white"
                                : i === 21
                                  ? "bg-gradient-to-r from-[#E2D62E] to-[#B81F3B] text-white"
                                  : "border border-white/20 text-white"
                  }`}
                  data-duration="0.6"
                  data-delay={0.6 + i * 0.05}
                  data-y="20"
                  data-scroll="true"
                  data-scroll-start="top 90%"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marquee - 주황/파랑 리본 스트립, 텍스트 한 줄 무한 스크롤 */}
      <section className="marquee-section relative w-full md:py-20 py-16 bg-black overflow-hidden min-h-[180px]">
        <div className="marquee-ribbon ribbon-orange">
          <div className="marquee-content marquee-orange-1">
            <span className="marquee-text">
              NO WEBSITE, NO TRUST • 홈페이지가 없으면 신뢰도 없습니다 • DON&apos;T LOSE YOUR CUSTOMERS • 잠재 고객은 기다려주지 않습니다 • WARNING: YOUR BUSINESS IS INVISIBLE •{" "}
            </span>
            <span className="marquee-text">
              NO WEBSITE, NO TRUST • 홈페이지가 없으면 신뢰도 없습니다 • DON&apos;T LOSE YOUR CUSTOMERS • 잠재 고객은 기다려주지 않습니다 • WARNING: YOUR BUSINESS IS INVISIBLE •{" "}
            </span>
            <span className="marquee-text">
              NO WEBSITE, NO TRUST • 홈페이지가 없으면 신뢰도 없습니다 • DON&apos;T LOSE YOUR CUSTOMERS • 잠재 고객은 기다려주지 않습니다 • WARNING: YOUR BUSINESS IS INVISIBLE •{" "}
            </span>
          </div>
        </div>
        <div className="marquee-ribbon reverse ribbon-blue">
          <div className="marquee-content marquee-blue-1">
            <span className="marquee-text">
              BREAK THE LIMIT • 한계를 넘는 성장 • HIGH CONVERSION • 압도적 전환율 • SMART STRATEGY • 멈추지 않는 비즈니스 엔진 • RUN YOUR BUSINESS •{" "}
            </span>
            <span className="marquee-text">
              BREAK THE LIMIT • 한계를 넘는 성장 • HIGH CONVERSION • 압도적 전환율 • SMART STRATEGY • 멈추지 않는 비즈니스 엔진 • RUN YOUR BUSINESS •{" "}
            </span>
            <span className="marquee-text">
              BREAK THE LIMIT • 한계를 넘는 성장 • HIGH CONVERSION • 압도적 전환율 • SMART STRATEGY • 멈추지 않는 비즈니스 엔진 • RUN YOUR BUSINESS •{" "}
            </span>
            <span className="marquee-text">
              BREAK THE LIMIT • 한계를 넘는 성장 • HIGH CONVERSION • 압도적 전환율 • SMART STRATEGY • 멈추지 않는 비즈니스 엔진 • RUN YOUR BUSINESS •{" "}
            </span>
            <span className="marquee-text">
              BREAK THE LIMIT • 한계를 넘는 성장 • HIGH CONVERSION • 압도적 전환율 • SMART STRATEGY • 멈추지 않는 비즈니스 엔진 • RUN YOUR BUSINESS •{" "}
            </span>
          </div>
        </div>
      </section>

      {/* Quote scroll popup */}
      <div
        id="quoteScrollPopup"
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] md:max-w-[640px] z-50 transition-opacity duration-300 ${
          quotePopupVisible ? "opacity-100 block" : "opacity-0 hidden"
        }`}
      >
        <div className="bg-main-1/70 rounded-2xl px-6 md:px-8 py-4 md:py-5 backdrop-blur-sm relative quote-popup-glow flex items-center justify-between gap-4 md:gap-6">
          <div className="flex-1">
            <p className="text-white text-[16px] md:text-[20px] leading-relaxed">
              우리 브랜드에 꼭 맞는
              <br className="block md:hidden" /> 웹사이트 견적서 받기
            </p>
          </div>
          <button
            type="button"
            onClick={handleInquiryClick}
            className="flex-shrink-0 px-6 md:px-8 py-3 md:py-4 bg-white text-gray-800 rounded-xl text-center font-semibold hover:bg-gray-100 transition-all duration-300 text-sm md:text-base whitespace-nowrap pointer"
          >
            빠른 견적 상담
          </button>
        </div>
      </div>

      {/* Portfolio / Cases */}
      <section id="cases" className="relative md:py-40 py-28 w-full min-h-0 z-10 bg-black">
        <div className="px-6 md:px-8 w-full text-center">
          <div
            className="line w-0.5 h-20 mb-6 bg-gradient-to-b from-transparent to-white mx-auto fadeDown"
            data-duration="1.0"
            data-delay="0"
            data-y="30"
            data-scroll="true"
            data-scroll-start="top 80%"
          />
          <h2
            className="text-white text-[32px] md:text-[50px] font-bold leading-tight fadeUp"
            data-duration="1.0"
            data-delay="0.2"
            data-y="30"
            data-scroll="true"
            data-scroll-start="top 80%"
          >
            단순히 예쁜 디자인이 아닌,
            <br />
            <span className="text-main-2">전환을 일으키는 흐름</span>을
            <br className="block md:hidden" /> 설계 했습니다.
          </h2>
          <p
            className="text-white/70 text-[18px] md:text-[24px] font-normal mt-7 leading-[130%] fadeUp"
            data-duration="1.0"
            data-delay="0.4"
            data-y="30"
            data-scroll="true"
            data-scroll-start="top 80%"
          >
            현장의 언어를 토대로<br className="block md:hidden" /> 콘텐츠 로직을 설계하고,
            <br />
            매출로 잇는 최적의<br className="block md:hidden" /> 구조를 만듭니다.
          </p>
        </div>
        <div className="w-full xl:max-w-screen-2xl mx-auto px-6 md:px-8 mt-16 md:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {portfolioWorks.length === 0 ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] animate-pulse overflow-hidden"
                >
                  <div className="h-[21.25rem] md:h-[26.25rem] bg-white/10 rounded-2xl" />
                  <div className="p-4 mt-5">
                    <div className="h-7 w-24 bg-white/10 rounded-md mb-4" />
                    <div className="h-8 w-32 bg-white/10 rounded mb-3" />
                    <div className="h-4 w-full bg-white/10 rounded" />
                  </div>
                </div>
              ))
            ) : (
              portfolioWorks.slice(0, 3).map((work, i) => (
                <button
                  key={work.slug}
                  type="button"
                  onClick={() => handleWorkClick(work)}
                  className="landing-portfolio-card group block w-full text-left rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors fadeUp cursor-pointer"
                  data-duration="1.0"
                  data-delay={0.5 + i * 0.2}
                  data-scroll="true"
                  data-scroll-start="top 80%"
                >
                  <div className="p-4">
                    <div className="portfolio-shot relative h-[21.25rem] md:h-[26.25rem] overflow-hidden rounded-2xl bg-black">
                      <div className="portfolio-shot-inner">
                        {/* img 사용: 호버 시 이미지 끝까지 스크롤 모션을 위해 높이 계산 필요 */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={work.thumbnail2 || work.thumbnail || "/images/work/placeholder-thum.png"}
                          alt={work.seoTitle || work.client || "포트폴리오 미리보기"}
                          className="portfolio-img block w-full min-h-full h-auto object-cover object-top"
                        />
                      </div>
                    </div>
                    <div className="mt-5">
                      <div className="flex items-center gap-2">
                        {work.service?.[0] && (
                          <span className="inline-flex items-center h-7 px-3 rounded-md bg-white/10 text-white/90 text-[16px]">
                            {work.service[0]}
                          </span>
                        )}
                        <span className="inline-flex items-center h-7 px-3 rounded-md bg-main-1 text-white text-[16px] font-semibold">
                          {work.year || "신규제작"}
                        </span>
                      </div>
                      <h3 className="mt-4 text-white text-[24px] md:text-[28px] font-semibold leading-tight">
                        {work.client || work.seoTitle?.replace(/\[[^\]]*\]\s*/g, "").split("–")[0]?.trim() || work.slug}
                      </h3>
                      {work.seoDesc && (
                        <p className="mt-3 text-white/60 text-[18px] md:text-[20px] leading-[160%] line-clamp-2">
                          {work.seoDesc}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 포트폴리오 상세 모달 */}
      <Modal
        open={!!selectedWork}
        onClose={handleClosePortfolioModal}
        title={selectedWork?.seoTitle || ""}
        size="lg"
        className="z-[2000]"
      >
        {loadingDetail ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-[9999px] h-12 w-12 border-t-2 border-b-2 border-main-1" />
          </div>
        ) : workDetail ? (
          <div className="space-y-6">
            {workDetail.cover && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={workDetail.cover}
                  alt={workDetail.seoTitle}
                  fill
                  className="object-cover"
                  sizes="(min-width: 920px) 920px, 92vw"
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-white/60 text-[20px] md:text-[14px] mb-2">Client</p>
                <p className="text-white text-[18px] md:text-[18px] font-semibold">{workDetail.client}</p>
              </div>
              <div>
                <p className="text-white/60 text-[20px] md:text-[14px] mb-2">Year</p>
                <p className="text-white text-[18px] md:text-[18px] font-semibold">{workDetail.year || "신규제작"}</p>
              </div>
              {workDetail.service?.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-white/60 text-[20px] md:text-[14px] mb-2">Service</p>
                  <div className="flex flex-wrap gap-2">
                    {workDetail.service.map((srv, idx) => (
                      <span key={idx} className="text-main-2 bg-main-1/10 px-3 py-1 rounded text-[18px] md:text-[14px]">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {workDetail.seoDesc && (
              <div>
                <p className="text-white/60 text-[20px] md:text-[14px] mb-2">Overview</p>
                <p className="text-white/90 text-[18px] md:text-[16px] leading-relaxed">{workDetail.seoDesc}</p>
              </div>
            )}
            {workDetail.portfolioImage && (
              <div className="pt-6 border-t border-white/10">
                <div className="relative w-full rounded-lg overflow-hidden">
                  <Image
                    src={workDetail.portfolioImage}
                    alt={`${workDetail.seoTitle} 포트폴리오`}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            )}
            {workDetail.href && (
              <div className="pt-6 flex justify-center">
                <a
                  href={workDetail.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-main-1 text-white font-bold rounded-[9999px] hover:bg-main-1/90 transition-all duration-300 hover:scale-105 text-[16px] md:text-[18px]"
                >
                  사이트 보기
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        ) : selectedWork && !loadingDetail ? (
          <div className="text-center py-20 text-white/60">포트폴리오 정보를 불러올 수 없습니다.</div>
        ) : null}
      </Modal>

      {/* Benefits */}
      <section id="benefits" className="relative">
        <div
          className="relative md:py-40 py-28 w-full min-h-0 z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/landing/gradient-bg01.webp')" }}
        >
          <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 mb-12 md:mb-16">
              <div
                className="speech-bubble fadeUp"
                data-duration="0.8"
                data-delay="0.1"
                data-y="20"
                data-scroll="true"
                data-scroll-start="top 80%"
              >
                <p className="text-black text-[20px] md:text-[30px] text-center font-semibold leading-tight">
                  이미지 하나 바꾸는데
                  <br /> 3일 걸리나요?
                </p>
              </div>
              <div
                className="speech-bubble md:-mt-32 fadeUp"
                data-duration="0.8"
                data-delay="0.3"
                data-y="20"
                data-scroll="true"
                data-scroll-start="top 80%"
              >
                <p className="text-black text-[20px] md:text-[30px] text-center font-semibold leading-tight">
                  텍스트 하나 수정하는데
                  <br /> 건당 3~10만원이요?
                </p>
              </div>
            </div>
            <div className="w-full text-center">
              <h2
                className="text-white text-[32px] md:text-[50px] font-bold leading-tight fadeUp"
                data-duration="1.0"
                data-delay="0.5"
                data-y="30"
                data-scroll="true"
                data-scroll-start="top 80%"
              >
                타사는 수정할 때마다
                <br className="block md:hidden" /> 유지보수 비용을<br className="block md:hidden" /> 청구합니다.
                <br />
                누비오는 <span className="text-main-2">자체 CMS</span>로
                <br className="block md:hidden" /> 직접 수정, 비용{" "}
                <span className="text-main-2">ZERO</span>.
              </h2>
              <p
                className="text-white/70 text-[18px] md:text-[24px] font-normal mt-7 leading-[130%] fadeUp"
                data-duration="1.0"
                data-delay="0.7"
                data-y="30"
                data-scroll="true"
                data-scroll-start="top 80%"
              >
                만들고 나서가<br className="block md:hidden" /> 더 중요한 홈페이지 제작
                <br />
                누비오 CMS는 코딩을 몰라도<br className="block md:hidden" /> 클릭 한 번으로 관리합니다.
              </p>
            </div>
          </div>
          <div className="xl:max-w-screen-2xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:grid-rows-3 xl:grid-rows-1 gap-4 md:gap-5 mt-16 md:mt-24">
            <div
              className="benefit-card h-[52rem] md:h-full xl:h-[56.25rem] rounded-xl bg-black bg-gradient-to-b from-transparent to-main-1/30 border border-white/50 md:row-span-2 px-8 py-10 md:px-12 md:py-16 fadeUp overflow-hidden"
              data-duration="0.8"
              data-delay="0.4"
              data-y="30"
              data-scroll="true"
              data-scroll-start="top 80%"
            >
              <h3 className="text-white text-[24px] md:text-[28px] leading-tight font-bold">
                페이지 내용 수정
              </h3>
              <p className="text-[18px] md:text-[20px] text-white/70 mt-2.5">
                아직도 텍스트 수정하나에 비용을 지불하시나요? 관리자 페이지에 제공된 디자인모드 기능으로 코딩 없이 간단하게 수정하세요.
              </p>
              <div className="w-[80rem] absolute left-8 md:left-12 mt-4">
                <video
                  src={ASSET("textmodify.mp4")}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-auto"
                  aria-label="페이지 내용 수정 데모"
                  title="페이지 내용 수정 데모"
                >
                  <p>이 브라우저는 비디오 재생을 지원하지 않습니다.</p>
                </video>
              </div>
            </div>
            <div
              className="md:row-span-2 grid gap-4 md:gap-5 h-[56.25rem] md:h-full xl:h-[56.25rem] fadeUp"
              data-duration="0.8"
              data-delay="0.5"
              data-y="30"
              data-scroll="true"
              data-scroll-start="top 80%"
            >
              <div className="benefit-card relative rounded-xl bg-black bg-gradient-to-b from-transparent to-main-1/30 border border-white/50 px-8 py-10 md:px-12 md:py-16 overflow-hidden">
                <h3 className="text-white text-[24px] md:text-[28px] leading-tight font-bold">문의 인박스 관리</h3>
                <p className="text-[18px] md:text-[20px] text-white/70 mt-2.5">
                  CMS 안에서 문의를 관리하고 원클릭으로 손쉽게 처리하세요.
                </p>
                <div className="w-[50rem] absolute left-8 md:left-12 mt-4">
                  <Image src={ASSET("benefit02.png")} alt="문의 인박스 관리" width={800} height={500} className="w-full h-auto" />
                </div>
              </div>
              <div className="benefit-card relative rounded-xl bg-black bg-gradient-to-b from-transparent to-main-1/30 border border-white/50 px-8 py-10 md:px-12 md:py-16 overflow-hidden">
                <h3 className="text-white text-[24px] md:text-[28px] leading-tight font-bold">내 맘대로 페이지 추가</h3>
                <p className="text-[18px] md:text-[20px] text-white/70 mt-2.5">
                  페이지 추가하려면 기본 10만원이죠 하지만 누비오 웹의 CMS는 페이지도 쉽게 추가합니다.
                </p>
                <div className="w-[30.9375rem] absolute left-8 md:left-12 mt-4">
                  <Image src={ASSET("benefit03.png")} alt="내 맘대로 페이지 추가" width={495} height={300} className="w-full h-auto" />
                </div>
              </div>
            </div>
            <div
              className="benefit-card h-[52rem] md:h-[28.0625rem] xl:h-[56.25rem] rounded-xl bg-black bg-gradient-to-b from-transparent to-main-1/30 border border-white/50 md:col-span-2 xl:col-span-1 xl:row-span-1 px-8 py-10 md:px-12 md:py-16 fadeUp overflow-hidden"
              data-duration="0.8"
              data-delay="0.5"
              data-y="30"
              data-scroll="true"
              data-scroll-start="top 80%"
            >
              <h3 className="text-white text-[24px] md:text-[28px] leading-tight font-bold">이미지·동영상 삽입</h3>
              <p className="text-[18px] md:text-[20px] text-white/70 mt-2.5">
                매번 업체에 이미지 바꿔달라고 요청하시나요? 관리자 페이지에 제공된 디자인모드 기능으로 코딩 없이 클릭 몇번으로 관리하세요.
              </p>
              <div className="w-[37.3125rem] absolute left-8 md:left-12 mt-4">
                <Image src={ASSET("benefit04.png")} alt="이미지·동영상 삽입" width={597} height={400} className="w-full h-auto" />
              </div>
            </div>
          </div>
          </div>
        </div>
        {/* Benefits 2 */}
        <div
          className="relative md:py-40 py-28 w-full min-h-0 z-10 bg-cover bg-center text-white"
          style={{ backgroundImage: "url('/landing/benefit02-bg.png')" }}
        >
          <div className="px-6 md:px-8 w-full text-center">
            <div
              className="line w-0.5 h-20 mb-6 bg-gradient-to-b from-transparent to-white mx-auto fadeDown"
              data-duration="1.0"
              data-delay="0"
              data-y="30"
              data-scroll="true"
              data-scroll-start="top 80%"
            />
            <h2
              className="text-white text-[32px] md:text-[50px] font-bold leading-tight fadeUp"
              data-duration="1.0"
              data-delay="0.2"
              data-y="30"
              data-scroll="true"
              data-scroll-start="top 80%"
            >
              합리적인 가격과 함께
              <br />
              <span className="text-main-2">다양한 혜택</span>을<br className="block md:hidden" /> 제공합니다.
            </h2>
            <p
              className="text-white/70 text-[18px] md:text-[24px] font-normal mt-7 leading-[130%] fadeUp"
              data-duration="1.0"
              data-delay="0.4"
              data-y="30"
              data-scroll="true"
              data-scroll-start="top 80%"
            >
              필요한 기능을 한 번에 구성해,
              <br />
              셋업 부담 없이 바로 시작하실 수 있습니다.
            </p>
          </div>
          <div className="w-full max-w-7xl mx-auto px-6 md:px-8 mt-16 md:mt-24">
            <div
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 fadeUp"
              data-duration="0.8"
              data-delay="0.2"
              data-y="30"
              data-scroll="true"
              data-scroll-start="top 80%"
            >
              {[
                { label: "반응형 홈페이지", icon: "streamline-freehand-color_worldwide-web-network-www.svg" },
                { label: "웹 표준", icon: "streamline-freehand-color_website-development-browser-hand.svg" },
                { label: "포털사이트 검색 등록", icon: "streamline-freehand-color_app-window-search-text.svg" },
                { label: "다양한 게시판", icon: "streamline-freehand-color_data-transfer-document-module.svg" },
                { label: "SSL 인증서 제공(1년)", icon: "streamline-freehand-color_security-computer-shield.svg" },
                { label: "방화벽 설치", icon: "streamline-freehand-color_security-shield-wall.svg" },
                { label: "폼 메일", icon: "streamline-freehand-color_content-write.svg" },
                { label: "관리자 페이지", icon: "streamline-freehand-color_optimization-graph-settings.svg" },
                { label: "저작권 확보 이미지", icon: "streamline-freehand-color_messages-bubble-image.svg" },
                { label: "팝업 기능", icon: "streamline-freehand-color_ui-webpage-slider-cursor.svg" },
                { label: "각종 API", icon: "streamline-freehand-color_server-api-cloud.svg" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/5 border border-white/10 rounded-xl px-5 md:px-6 py-12 md:py-16 flex flex-col items-center justify-center gap-4 min-h-[120px] md:min-h-[140px] transition-all duration-300 hover:bg-white/8 hover:border-white/20 hover:-translate-y-1"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center relative">
                    <Image src={ASSET(item.icon)} alt={item.label} width={48} height={48} className="w-full h-full object-contain" />
                  </div>
                  <p className="text-white text-[18px] md:text-[24px] font-medium text-center leading-[1.4]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section
        id="reviews"
        className="relative md:py-40 py-28 w-full min-h-0 z-10 bg-cover md:bg-center bg-right"
        style={{ backgroundImage: "url('/landing/reviews-bg.png')" }}
      >
        <div className="text-white">
          <div className="px-6 md:px-8 w-full text-center">
            <div
              className="line w-0.5 h-20 mb-6 bg-gradient-to-b from-transparent to-white mx-auto fadeDown"
              data-duration="1.0"
              data-delay="0"
              data-y="30"
              data-scroll="true"
              data-scroll-start="top 80%"
            />
            <h2
              className="text-white text-[32px] md:text-[50px] font-bold leading-tight fadeUp"
              data-duration="1.0"
              data-delay="0.2"
              data-y="30"
              data-scroll="true"
              data-scroll-start="top 80%"
            >
              누비오 CMS를 이용하면,
              <br />
              <span className="text-main-2">업체 답변 기다릴 시간</span>에
              <br />
              이미 수정 끝내고<br className="md:hidden"/>  <span className="text-main-2">퇴근</span>합니다.
            </h2>
            <p
              className="text-white/70 text-[18px] md:text-[24px] font-normal mt-7 leading-[130%] fadeUp"
              data-duration="1.0"
              data-delay="0.4"
              data-y="30"
              data-scroll="true"
              data-scroll-start="top 80%"
            >
              오타 하나 고치는데 3일씩 걸리던 답답함,
              <br />
              이제 끝내세요. 이미지 교체부터 텍스트 수정까지
              <br />
              마우스 클릭만으로 실시간 반영되니까요.
              <br />
              <br />
              외주 업체와 지루한 메일 주고받을 시간에,
              <br />
              저는 이미 수정을 마치고 여유롭게 퇴근합니다.
            </p>
          </div>
        </div>
        <div
          className="w-full mt-16 md:mt-24 overflow-hidden fadeUp"
          data-duration="1.0"
          data-delay="0.4"
          data-y="30"
          data-scroll="true"
          data-scroll-start="top 80%"
        >
          <div className="review-marquee-container">
            <div className="review-marquee-content">
              {(() => {
                const reviewList = [
                  { title: "코딩 하나도 모르는데 홈페이지 관리가 가능하네요", body: "관리자 페이지가 너무 직관적이라 놀랐어요. 블로그 글 쓰는 것보다 쉽습니다. 개발 지식 전혀 없는 저희 직원들도 디자인을 변경할 수 있어요" },
                  { title: "유지보수 업체 연락 두절... 리뉴얼하고 칼퇴해요", body: "기존 업체가 갑자기 연락이 안 돼서 발만 동동 구르던 적이 있어요. 이젠 제가 모든 권한을 가지고 직접 관리하니까 마음이 너무 편합니다. 독립한 기분이에요!" },
                  { title: "디자인이 깔끔하고 작업 속도가 빠릅니다", body: "디자인이 깔끔하고 요청 드린 기능도 예상했던 것보다 훨씬 좋게 나와서 진짜 만족스러워요. 처음에는 좀 간단하게 하려다 만들어 주시는 거 보고 이것저것 기능을 추가하게 됐는데 빠르게 잘해주셨습니다." },
                  { title: "직접 수정했는데 모바일이나 PC에서 전혀 문제가 없어요", body: "수정하고 나서 폰으로 확인해 보면 텍스트가 짤리거나 이미지가 밀리는 일이 없어요. 반응형 디자인이 자동으로 잡히니까 수정 작업에 대한 스트레스가 0에 가깝습니다." },
                  { title: "전문 지식 없어도 SEO 100점 맞을 수 있습니다", body: "SEO가 뭔지도 몰랐던 초보 사장인데, AI가 시키는 대로 '딸깍' 하니까 검색 결과 상단에 우리 가게가 뜨네요. 전문가한테 수십만원 주고 맡기던 컨설팅보다 훨씬 낫습니다." },
                  { title: "신입 사원도 30분 교육받고 바로 실무 투입됩니다", body: "인수인계가 너무 편해요. 복잡한 매뉴얼 필요 없이 \"여기 클릭해서 글만 바꾸면 돼\"라고 하면 끝이니까요. 관리 인건비와 교육 시간이 획기적으로 줄어들었습니다." },
                ];
                return [...reviewList, ...reviewList].map((r, i) => (
                <div key={`review-${i}`} className="review-card">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className="text-main-2 text-xl">★</span>
                    ))}
                  </div>
                  <h3 className="text-white text-[18px] md:text-[24px] font-bold mb-3">{r.title}</h3>
                  <p className="text-white/80 text-[16px] md:text-[18px] leading-relaxed">{r.body}</p>
                </div>
              ));
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Fee */}
      <section id="fee" className="relative md:py-40 py-28 w-full min-h-0 z-10 bg-black">
        <div className="px-6 md:px-8 w-full text-center">
          <div
            className="line w-0.5 h-20 mb-6 bg-gradient-to-b from-transparent to-white mx-auto fadeDown"
            data-duration="1.0"
            data-delay="0"
            data-y="30"
            data-scroll="true"
            data-scroll-start="top 80%"
          />
          <h2
            className="text-white text-[32px] md:text-[50px] font-bold leading-tight fadeUp"
            data-duration="1.0"
            data-delay="0.2"
            data-y="30"
            data-scroll="true"
            data-scroll-start="top 80%"
          >
            불필요한 거품은 빼고,
            <br />
            성장에만 집중하는
            <br className="block md:hidden" /> <span className="text-main-2">합리적인 선택</span>
          </h2>
          <p
            className="text-white/70 text-[18px] md:text-[24px] font-normal mt-7 leading-[130%] fadeUp"
            data-duration="1.0"
            data-delay="0.4"
            data-y="30"
            data-scroll="true"
            data-scroll-start="top 80%"
          >
            매달 청구되는 정체 모를<br className="block md:hidden" /> 유지보수비에 지치셨나요?
            <br />
            누비오는 투명한 정찰제와 한 번의 제작으로
            <br className="block md:hidden" /> 평생 수정 자유를 약속합니다.
            <br />
            우리 비즈니스 규모에 딱 맞는<br className="block md:hidden" /> 최적의 플랜을 확인해 보세요.
          </p>
        </div>
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 mt-16 md:mt-24">
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 fadeUp"
            data-duration="0.8"
            data-delay="0.2"
            data-y="30"
            data-scroll="true"
            data-scroll-start="top 80%"
          >
            {[
              { name: "랜딩 페이지", delPrice: "66", price: "39", features: ["단일 목적 원페이지 기본 5 섹션 제공"], more: ["기본 검색엔진(SEO) 최적화", "성능 최적화", "속도 최적화", "반응형 제작", "UX 플로우 설계", "핵심 메시지, 맞춤형 카피라이팅 제공", "기본 애니메이션 제공"] },
              { name: "기본 홈페이지 제작", delPrice: "110", price: "65", features: ["메인 포함 11P 이내", "페이지 추가 기능 제공"], more: ["기본 검색엔진(SEO) 최적화", "성능 최적화", "속도 최적화", "반응형 제작", "UX 플로우 설계", "핵심 메시지, 맞춤형 카피라이팅 제공", "몰입형 인터랙션 제공"] },
              { name: "프리미엄 홈페이지 제작", delPrice: "250", price: "190", features: ["페이지 수 별도 협의", "목적별 맞춤 페이지 설계", "페이지 추가 기능 제공", "게시판 추가 기능 제공", "AI 기능 제공", "사용자 여정을 고려한 UX/UI 설계", "검색엔진 고도화·키워드 전략 반영"], more: ["기본 검색엔진(SEO) 최적화", "성능 최적화", "속도 최적화", "반응형 제작", "핵심 메시지, 맞춤형 카피라이팅 제공", "몰입형 인터랙션 제공"] },
            ].map((plan) => (
              <div
                key={plan.name}
                className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-4 lg:p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/8 hover:border-white/20 hover:-translate-y-1"
              >
                <div className="mb-0 pb-6 border-b border-white/10">
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-1">{plan.name}</h3>
                  <div className="flex flex-col items-baseline gap-3 flex-wrap">
                    <h4 className="text-white text-[18px] md:text-[24px]">
                      <del className="block text-white/50 text-[16px] md:text-[20px]">{plan.delPrice} 만원</del> 
                      <span className="text-[32px] md:text-[50px] font-bold leading-10">{plan.price}</span>만원 부터
                    </h4>
                    <span className="bg-main-1 text-white text-base font-semibold px-2 py-1 rounded">VAT 별도</span>
                  </div>
                </div>
                <ul className="list-none py-4 m-0 flex flex-col gap-4 border-b border-white/10">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-white/90 text-[16px] md:text-[18px] leading-relaxed">
                      <Image src={ASSET("lets-icons_check-fill.svg")} alt="" width={24} height={24} className="w-6 h-6 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <ul className="list-none py-4 m-0 flex flex-col gap-4">
                  {plan.more.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-white/90 text-[16px] md:text-[18px] leading-relaxed">
                      <Image src={ASSET("lets-icons_check-fill.svg")} alt="" width={24} height={24} className="w-6 h-6 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry */}
      <section
        id="inquiry"
        className="relative md:py-40 py-28 w-full min-h-0 z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/landing/inquiry-bg.png')" }}
      >
        <div className="px-6 md:px-8 w-full text-center">
          <div
            className="line w-0.5 h-20 mb-6 bg-gradient-to-b from-transparent to-white mx-auto fadeDown"
            data-duration="1.0"
            data-delay="0"
            data-y="30"
            data-scroll="true"
            data-scroll-start="top 80%"
          />
          <h2
            className="text-white text-[32px] md:text-[50px] font-bold leading-tight fadeUp"
            data-duration="1.0"
            data-delay="0.2"
            data-y="30"
            data-scroll="true"
            data-scroll-start="top 80%"
          >
            <span className="text-main-2">홈페이지 제작</span>
            <br />
            더 이상 망설이지 마세요!
          </h2>
          <p
            className="text-white/70 text-[18px] md:text-[24px] font-normal mt-7 leading-[130%] fadeUp"
            data-duration="1.0"
            data-delay="0.4"
            data-y="30"
            data-scroll="true"
            data-scroll-start="top 80%"
          >
            비즈니스는 신뢰가 최우선입니다.
            <br />
            궁금하신 사항이나 제작 문의를 남겨주시면
            <br />
            신속하게 답변드리도록 하겠습니다.
          </p>
        </div>
        <div className="w-full max-w-4xl mx-auto px-6 md:px-8 mt-16 md:mt-24">
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 lg:p-10 backdrop-blur-sm fadeUp"
            data-duration="0.8"
            data-delay="0.6"
            data-y="30"
            data-scroll="true"
            data-scroll-start="top 80%"
          >
            <div className="mb-6">
              <label htmlFor="company" className="block text-white text-base md:text-[18px] font-medium mb-2">
                상호명 <span className="text-main-2">(필수)</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                className="w-full px-4 py-3 text-[16px] bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-main-1 focus:ring-2 focus:ring-main-1/50 transition-all"
                placeholder="상호명을 입력해주세요"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="name" className="block text-white text-base md:text-[18px] font-medium mb-2">
                담당자 성함 <span className="text-main-2">(필수)</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 text-[16px] bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-main-1 focus:ring-2 focus:ring-main-1/50 transition-all"
                placeholder="담당자 성함을 입력해주세요"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="phone" className="block text-white text-base md:text-[18px] font-medium mb-2">
                연락처 <span className="text-main-2">(필수)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-4 py-3 text-[16px] bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-main-1 focus:ring-2 focus:ring-main-1/50 transition-all"
                placeholder="연락처를 입력해주세요 (예: 010-1234-5678)"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="website" className="block text-white text-base md:text-[18px] font-medium mb-2">
                현재 운영중인 홈페이지가 있다면 링크를 작성해주세요.
              </label>
              <input
                type="url"
                id="website"
                name="website"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-main-1 focus:ring-2 focus:ring-main-1/50 transition-all"
                placeholder="https://example.com (선택사항)"
              />
            </div>
            <div className="mb-6">
              <label className="block text-white text-base md:text-[18px] font-medium mb-3">
                제작하고자 하는 사이트 유형 <span className="text-main-2">(필수)</span>
              </label>
              <div className="space-y-3">
                {[
                  { value: "landing", label: "랜딩 페이지" },
                  { value: "basic", label: "기본 홈페이지 제작" },
                  { value: "premium", label: "프리미엄 홈페이지 제작" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="plan"
                      value={opt.value}
                      required
                      className="w-5 h-5 text-main-1 bg-white/10 border-white/20 focus:ring-main-1 focus:ring-2 cursor-pointer accent-main-1"
                    />
                    <span className="ml-3 text-white text-base group-hover:text-main-2 transition-colors">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-white text-base md:text-[18px] font-medium mb-3">누비오를 어떻게 알게 되셨나요?</label>
              <div className="space-y-3">
                {[
                  { value: "instagram-facebook", label: "인스타/페이스북 광고" },
                  { value: "naver", label: "네이버 검색" },
                  { value: "google", label: "구글 검색" },
                  { value: "referral", label: "지인 소개" },
                  { value: "other", label: "기타" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center cursor-pointer group">
                    <input type="radio" name="source" value={opt.value} className="w-5 h-5 accent-main-1 cursor-pointer" />
                    <span className="ml-3 text-white text-base group-hover:text-main-2 transition-colors">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="inquiry" className="block text-white text-base md:text-[18px] font-medium mb-2">
                문의 혹은 궁금하신 점이 있다면 자유롭게 작성해주세요.
              </label>
              <textarea
                id="inquiry"
                name="inquiry"
                rows={5}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-main-1 focus:ring-2 focus:ring-main-1/50 transition-all resize-none"
                placeholder="문의사항을 자유롭게 작성해주세요 (선택사항)"
              />
            </div>
            <div className="mb-8">
              <div className="flex items-center justify-between gap-4">
                <label className="flex items-start cursor-pointer group flex-1">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    required
                    className="mt-1 w-5 h-5 accent-main-1 cursor-pointer flex-shrink-0"
                  />
                  <span className="ml-3 text-white text-base leading-relaxed group-hover:text-main-2 transition-colors">
                    개인정보 수집 및 이용에 동의합니다. <span className="text-main-2">(필수)</span>
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setPrivacyOpen(true)}
                  className="px-4 py-2 text-sm md:text-base text-main-2 border border-main-2 rounded-lg hover:bg-main-2 hover:text-white transition-all duration-300 flex-shrink-0 whitespace-nowrap"
                >
                  내용 확인
                </button>
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-12 py-4 bg-main-1 text-white text-base md:text-lg font-semibold rounded-lg hover:bg-main-1/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-main-1/50 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "전송 중..." : "문의하기"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full bg-black border-t border-white/10 py-12 md:py-16">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col items-center gap-2 mb-8">
            <p className="text-white/70 text-sm md:text-base">문의 전화</p>
            <a href="tel:0507-1370-6110" className="text-white text-2xl md:text-3xl lg:text-4xl font-bold hover:text-main-2 transition-colors duration-300">
              0507-1370-6110
            </a>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-white/70 text-xs md:text-sm">
                <span>사업자번호 : 607-31-05853</span>
                <span className="hidden md:inline">|</span>
                <span>대표 : 이형석</span>
                <span className="hidden md:inline">|</span>
                <a href="mailto:nuvio@naver.com" className="hover:text-white transition-colors">
                  메일 : nuvio@naver.com
                </a>
              </div>
              <p className="text-white/50 text-xs md:text-sm mt-4">© 2026 nuvio. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity ${
          privacyOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        style={{ display: privacyOpen ? "flex" : "none" }}
        onClick={() => privacyOpen && setPrivacyOpen(false)}
      >
        <div
          className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto bg-black border border-white/20 rounded-xl p-6 md:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <h3 className="text-white text-xl md:text-2xl font-bold">개인정보 수집 및 이용 동의</h3>
            <button type="button" className="text-white/70 hover:text-white text-2xl font-light" onClick={() => setPrivacyOpen(false)}>
              ×
            </button>
          </div>
          <div className="text-white/90 text-sm md:text-base leading-relaxed space-y-4">
            <div>
              <h4 className="text-white text-lg font-semibold mb-2">1. 수집하는 개인정보의 항목</h4>
              <p>누비오는 문의하기 서비스를 제공하기 위해 다음과 같은 개인정보를 수집합니다.</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>필수항목: 상호명, 담당자 성함, 연락처, 희망 요금제, 알게 된 경로</li>
                <li>선택항목: 현재 운영중인 홈페이지 링크, 문의사항</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-2">2. 개인정보의 수집 및 이용 목적</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>홈페이지 제작 문의 접수 및 상담 서비스 제공</li>
                <li>고객 문의사항에 대한 답변 및 안내</li>
                <li>서비스 개선을 위한 통계 및 분석</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-2">3. 개인정보의 보유 및 이용 기간</h4>
              <p>수집된 개인정보는 문의 접수일로부터 3년간 보관하며, 이후 지체 없이 파기합니다.</p>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-2">4. 개인정보의 제3자 제공</h4>
              <p>누비오는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우 등 예외가 있습니다.</p>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-2">5. 동의 거부 권리 및 불이익</h4>
              <p>이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 동의를 거부할 경우 문의하기 서비스 이용이 제한될 수 있습니다.</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => setPrivacyOpen(false)}
              className="px-8 py-3 bg-main-1 text-white text-base font-semibold rounded-lg hover:bg-main-1/90 transition-all duration-300"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
