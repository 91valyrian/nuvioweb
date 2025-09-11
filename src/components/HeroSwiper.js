"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, A11y } from "swiper/modules";
import { useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// 슬라이드 데이터 (이미지 경로는 /public 기준)
const slides = [
  {
    src: "/hero/heroSlide1.jpg",
    alt: "Branding Website",
    title: "완벽한 첫인상,<br class='block md:hidden' /> 기업의 가치를<br />높이는 브랜딩<br class='block md:hidden' /> 홈페이지",
    subtitle: "당신의 비즈니스가 가질 수 있는<br class='block md:hidden' /> 최고의 인상을 홈페이지에 담아냅니다.",
    ctaLabel: "Contact",
    ctaHref: "/contact",
  },
  {
    src: "/hero/heroSlide2.jpg",
    alt: "E‑Commerce",
    title: "Faster to Market",
    subtitle: "Modern e‑commerce, built for growth",
    ctaLabel: "View Work",
    ctaHref: "/work",
  },
  {
    src: "/hero/heroSlide3.jpg",
    alt: "Landing Page",
    title: "Convert with Clarity",
    subtitle: "Focused one‑page experiences that perform",
    ctaLabel: "Our Services",
    ctaHref: "/service",
  },
];

export default function HeroSwiper() {
  const [active, setActive] = useState(0);
  return (
    <section className="relative">
      <Swiper
        className="w-full h-[1280px] md:h-[100vh]"
        modules={[Autoplay, Pagination, Navigation, A11y]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 40000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{ nextEl: ".hero-next", prevEl: ".hero-prev" }}
        a11y={{ enabled: true }}
        onBeforeInit={(swiper) => {
          // Ensure Swiper binds to external nav buttons rendered outside Swiper
          swiper.params.navigation = {
            ...(swiper.params.navigation || {}),
            prevEl: ".hero-prev",
            nextEl: ".hero-next",
          };
          // Initialize navigation after params are set
          if (swiper.navigation) {
            swiper.navigation.init();
            swiper.navigation.update();
          }
        }}
        onSlideChange={(sw) => {
          if (typeof sw?.realIndex === "number") setActive(sw.realIndex);
        }}
      >
        {slides.map((slides, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative h-full w-full">
              {/* 배경 이미지 */}
              <div className="absolute inset-0">
                <Image
                  src={slides.src}
                  alt={slides.alt}
                  fill
                  priority={idx === 0}
                  fetchPriority={idx === 0 ? "high" : "auto"}
                  loading={idx === 0 ? "eager" : "lazy"}
                  sizes="100vw"
                  quality={90}
                  style={{ objectFit: "cover" }}
                />
                {/* 상단→하단 그라데이션 오버레이 */}
              </div>

              {/* 텍스트 레이어 */}
              <div className="relative z-10 flex h-full items-center">
                <div className="container mx-auto px-5 md:px-6 max-w-[1600px]">
                  <div
                    className={`max-w-[840px] mx-auto text-center text-neutral-100 opacity-0 transition-transform transition-opacity duration-700 ease-out ${active === idx ? "animate-[fadeInScale_0.8s_ease-out_0.3s_forwards]" : ""}`}
                    key={`text-${idx}-${active === idx ? "active" : "idle"}`}
                  >
                    <h2 className="text-[78px] md:text-[61px] leading-[88px] md:leading-[71px] font-bold" dangerouslySetInnerHTML={{ __html: slides.title }} />
                    <p className="mt-[50px] text-[34px] md:text-[24px] text-neutral-400" dangerouslySetInnerHTML={{ __html: slides.subtitle }} />
                    <div className="mt-6">
                      <Link
                        href={slides.ctaHref}
                        className="inline-flex items-center gap-2 rounded-[9999px] border-2 border-neutral-100/80 px-5 py-2 text-[16px] font-medium text-neutral-100 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-300"
                      >
                        {slides.ctaLabel}
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 네비게이션 버튼 */}
      <div className="container absolute left-1/2 translate-x-[-50%] -bottom-[-120px] z-50 flex justify-between">
        <div className="scroll flex"></div>
        <div className="flex gap-[">
            <button
                className="cursor-pointer hero-prev pointer-events-auto w-[80px] h-[80px] rounded-[9999px] text-white backdrop-blur-[6px] bg-white/10 hover:bg-black/60 transition"
                aria-label="Previous slide"
            >
                ‹
            </button>
            <button
                className="cursor-pointer hero-next pointer-events-auto w-[80px] h-[80px] rounded-[9999px] text-white backdrop-blur-[6px] bg-white/10 hover:bg-black/60 transition"
                aria-label="Next slide"
            >
                ›
            </button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}
