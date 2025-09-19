"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, A11y } from "swiper/modules";
import { useState, useRef, useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// 슬라이드 데이터 (첫 슬라이드는 비디오 배경, 나머지는 이미지)
const slides = [
  {
    src: "/main/heroSlide1.mp4",
    alt: "Branding Website",
    title: "완벽한 첫인상,<br class='block md:hidden' /> 기업의 가치를<br />높이는 브랜딩<br class='block md:hidden' /> 홈페이지",
    subtitle: "당신의 비즈니스가 가질 수 있는<br class='block md:hidden' /> 최고의 인상을 홈페이지에 담아냅니다.",
    ctaLabel: "Contact",
    ctaHref: "/contact",
  },
  {
    src: "/main/heroSlide2.jpg",
    alt: "Branding Website",
    title: "완벽한 첫인상,<br class='block md:hidden' /> 기업의 가치를<br />높이는 브랜딩<br class='block md:hidden' /> 홈페이지",
    subtitle: "당신의 비즈니스가 가질 수 있는<br class='block md:hidden' /> 최고의 인상을 홈페이지에 담아냅니다.",
    ctaLabel: "Contact",
    ctaHref: "/contact",
  },
  {
    src: "/main/heroSlide3.jpg",
    alt: "Landing Page",
    title: "완벽한 첫인상,<br class='block md:hidden' /> 기업의 가치를<br />높이는 브랜딩<br class='block md:hidden' /> 홈페이지",
    subtitle: "당신의 비즈니스가 가질 수 있는<br class='block md:hidden' /> 최고의 인상을 홈페이지에 담아냅니다.",
    ctaLabel: "Contact",
    ctaHref: "/contact",
  },
];

export default function HeroSwiper() {
  const [active, setActive] = useState(0);
  const swiperRef = useRef(null);
  const videoRef = useRef(null);
  const isVideoActiveRef = useRef(false);
  const playTimerRef = useRef(null);

  const startVideo = (sw) => {
    if (!videoRef.current) return;
    // Stop Swiper autoplay while video plays
    try { sw?.autoplay?.stop?.(); } catch {}
    isVideoActiveRef.current = true;
    // Clear any pending timers
    if (playTimerRef.current) clearTimeout(playTimerRef.current);
    // Nudge play after transition ends/DOM ready
    playTimerRef.current = setTimeout(() => {
      try {
        videoRef.current.currentTime = 0;
        const p = videoRef.current.play?.();
        if (p && typeof p.then === "function") {
          p.catch(() => {/* ignore autoplay blocking */});
        }
      } catch {}
    }, 50);
  };

  const stopVideo = () => {
    if (!videoRef.current) return;
    isVideoActiveRef.current = false;
    if (playTimerRef.current) clearTimeout(playTimerRef.current);
    try { videoRef.current.pause?.(); } catch {}
  };

  useEffect(() => {
    const t = setTimeout(() => {
      const sw = swiperRef.current;
      if (sw && sw.realIndex === 0) startVideo(sw);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative">
      <Swiper
        className="w-full h-[1280px] md:h-[100vh]"
        modules={[Autoplay, Pagination, Navigation, A11y]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation={{ nextEl: ".hero-next", prevEl: ".hero-prev" }}
        a11y={{ enabled: true }}
        onSwiper={(sw) => { swiperRef.current = sw; }}
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
        onSlideChangeTransitionEnd={(sw) => {
          const idx = sw?.realIndex ?? 0;
          if (idx === 0) {
            // Entered video slide: play video and stop autoplay
            startVideo(sw);
          } else {
            // Left video slide: stop video and enable autoplay every 5s
            stopVideo();
            try {
              sw.params.autoplay = { ...(sw.params.autoplay || {}), delay: 5000, disableOnInteraction: false };
              sw.autoplay?.start?.();
            } catch {}
          }
        }}
      >
        {slides.map((slides, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative h-full w-full">
              {/* 배경 이미지 또는 비디오 */}
              <div className="absolute inset-0">
                {idx === 0 ? (
                  <video
                    ref={videoRef}
                    id="hero-video"
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    muted
                    // iOS 사파리 자동재생 호환을 위해 muted 필요
                    preload="auto"
                    poster={slides.src.replace(/\.mp4$/i, ".jpg")}
                    onEnded={() => {
                      // 비디오가 끝나면 다음 슬라이드로 이동, 이후 슬라이드는 5초 autoplay
                      try {
                        const sw = swiperRef.current;
                        sw?.slideNext();
                        if (sw) {
                          sw.params.autoplay = { ...(sw.params.autoplay || {}), delay: 5000, disableOnInteraction: false };
                          sw.autoplay?.start();
                        }
                      } catch {}
                    }}
                    onPlay={() => { isVideoActiveRef.current = true; }}
                    onPause={() => { isVideoActiveRef.current = false; }}
                  >
                    {/* 비디오 소스: /public/main/heroSlide1.mp4 로 가정 */}
                    <source src="/main/heroSlide1.mp4" type="video/mp4" />
                  </video>
                ) : (
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
                )}
                {/* 상단→하단 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
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
                    
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 네비게이션 버튼 */}
      <div className="container absolute left-1/2 translate-x-[-50%] -bottom-[-120px] z-50 flex justify-between" data-reveal="fade-up" data-reveal-delay="0.2" data-reveal-offset="1.5">
        <div className="scroll flex items-center">
            <div className="scroll-ico flex gap-[20px] md:gap-[10px] items-center">
                <div className="ico relative rounded-[9999px] w-[80px] h-[120px] md:w-[50px] md:h-[80px] border-[2px] border-white flex flex-col items-center justify-center overflow-hidden">
                    <div className="line absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[-5px] w-[6px] md:w-[3px] h-[35px] overflow-hidden rounded-[3px]">
                      <div className="absolute inset-0 line-track-bg"></div>
                      {/* moving gradient sheen */}
                      <div className="relative w-full h-full bg-gradient-to-t from-white/90 to-transparent animate-lineFlow"></div>
                    </div>
                    <Image className="touch-ico mr-[-5px] animate-touchMove w-[34px] md:w-[24px] h-[auto]" src="/main/touch-ico.svg" alt="Touch Icon" width={24} height={24} />
                </div>
                <span className="font-miller font-light italic text-[24px] md:text-[16px] ">Scroll to explore</span>
            </div>
        </div>
        <div className="flex items-center gap-[20px] md:gap-[10px] md:mr-[120px]">
            <button
                className="hero-prev flex items-center justify-center cursor-pointer pointer-events-auto w-[100px] h-[100px] md:w-[80px] md:h-[80px] rounded-[9999px] text-white backdrop-blur-[6px] bg-white/10 hover:bg-white/30 transition"
                aria-label="Previous slide"
            >
                <Image src="/main/hero-prev.svg"
                    alt="Previous"
                    width={12}
                    height={24}
                    className="w-[20px] md:w-[12px] h-auto "
                />
            </button>
            <button
                className="hero-next flex items-center justify-center cursor-pointer pointer-events-auto w-[100px] h-[100px] md:w-[80px] md:h-[80px] rounded-[9999px] text-white backdrop-blur-[6px] bg-white/10 hover:bg-white/30 transition"
                aria-label="Next slide"
            >
                <Image src="/main/hero-next.svg"
                    alt="Next"
                    width={12}
                    height={24}
                    className="w-[20px] md:w-[12px] h-auto "
                />
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
