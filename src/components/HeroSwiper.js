"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// 슬라이드 데이터 (이미지 경로는 /public 기준)
const slides = [
  {
    src: "/hero/heroSlide1.jpg",
    alt: "Branding Website",
    title: "Perfect First Impressions",
    subtitle: "Websites that Elevate Your Brand Value",
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
  return (
    <section className="relative">
      <Swiper
        className="w-full h-[70vh] md:h-[85vh]"
        modules={[Autoplay, Pagination, Navigation, A11y]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{ nextEl: ".hero-next", prevEl: ".hero-prev" }}
        a11y={{ enabled: true }}
      >
        {slides.map((s, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative h-full w-full">
              {/* 배경 이미지 */}
              <div className="absolute inset-0">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  style={{ objectFit: "cover" }}
                />
                {/* 상단→하단 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
              </div>

              {/* 텍스트 레이어 */}
              <div className="relative z-10 flex h-full items-center">
                <div className="container mx-auto px-5 md:px-6 max-w-[1600px]">
                  <div className="max-w-[840px] text-neutral-100">
                    <h2 className="text-[clamp(28px,6vw,64px)] leading-[1.1] font-semibold">
                      {s.title}
                    </h2>
                    <p className="mt-3 text-[clamp(14px,2.4vw,20px)] opacity-90">
                      {s.subtitle}
                    </p>
                    <div className="mt-6">
                      <Link
                        href={s.ctaHref}
                        className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-100/80 px-5 py-2 text-[16px] font-medium text-neutral-100 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-300"
                      >
                        {s.ctaLabel}
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
      <button
        className="hero-prev absolute left-3 top-1/2 -translate-y-1/2 z-20 grid place-items-center w-10 h-10 rounded-full bg-black/40 text-white backdrop-blur-[6px] hover:bg-black/60 transition"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        className="hero-next absolute right-3 top-1/2 -translate-y-1/2 z-20 grid place-items-center w-10 h-10 rounded-full bg-black/40 text-white backdrop-blur-[6px] hover:bg-black/60 transition"
        aria-label="Next slide"
      >
        ›
      </button>
    </section>
  );
}
