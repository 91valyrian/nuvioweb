"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GlobalReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // 기존 트리거 모두 제거
    ScrollTrigger.getAll().forEach((st) => st.kill());

    // 새 페이지의 fade-up 요소들 재등록
    const fadeElements = gsap.utils.toArray(".fade-up");
    const rotateElements = gsap.utils.toArray(".rotate-x-up");

    fadeElements.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    rotateElements.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 40, rotateX: "90deg" },
        {
          y: 0,
          duration: 0.8,
          rotateX: "0deg",
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    ScrollTrigger.matchMedia({
      // ✅ PC (768px 이상)
      "(min-width: 769px)": function () {
        gsap.to(".cover", {
          y: -100,
          width: "100%",
          borderRadius: 0,
          scrollTrigger: {
            trigger: ".cover",
            start: "top top",
            end: "bottom top",
            scrub: true,
            markers: false,
          },
        });
      },

      // ✅ 모바일 (768px 이하)
      "(max-width: 768px)": function () {
        gsap.to(".cover", {
          y: -100,
          width: "100%",
          borderRadius: 0,
          scrollTrigger: {
            trigger: ".cover",
            start: "top 20%", // ← 모바일용 다른 start 시점
            end: "bottom top",
            scrub: true,
            markers: false,
          },
        });
      },
    });

    // cleanup
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [pathname]); // ✅ 페이지 전환 시마다 다시 실행

  return null;
}
