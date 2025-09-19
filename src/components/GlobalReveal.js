"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

// data-reveal 값에 따른 from 상태 프리셋
function getPreset(type) {
  switch (type) {
    case "fade-up":    return { y: 24,  opacity: 0 };
    case "fade-down":  return { y: -24, opacity: 0 };
    case "fade-left":  return { x: 24,  opacity: 0 };
    case "fade-right": return { x: -24, opacity: 0 };
    case "scale-in":   return { scale: 0.8, opacity: 0 };
    case "fade-in":
    default:           return { opacity: 0 };
  }
}

function initReveal(root = document) {
  const nodes = Array.from(root.querySelectorAll("[data-reveal]"));
  if (!nodes.length) return;

  nodes.forEach((el) => {
    // 이미 세팅된 요소는 중복 방지
    if (el.__revealed) return;

    const type = (el.getAttribute("data-reveal") || "fade-in").trim();
    const once = (el.getAttribute("data-reveal-once") || "true") === "true";
    const delay = parseFloat(el.getAttribute("data-reveal-delay") || "0") || 0;
    const duration = parseFloat(el.getAttribute("data-reveal-duration") || "0.6") || 0.6;
    const offset = parseFloat(el.getAttribute("data-reveal-offset") || "0.85") || 0.85;

    const fromVars = getPreset(type);
    const toVars = { opacity: 1, x: 0, y: 0, scale: 1, duration, delay, ease: "power3.out" };

    // 컨테이너에 stagger 지정 시, 자식들을 순차 노출
    const stagger = parseFloat(el.getAttribute("data-reveal-stagger") || "0") || 0;
    const targets = stagger > 0 ? Array.from(el.children) : [el];

    // 초기값 세팅
    gsap.set(targets, fromVars);

    // 트리거
    const triggerTarget = stagger > 0 ? el : el;
    gsap.to(targets, {
      ...toVars,
      stagger: stagger > 0 ? stagger : 0,
      scrollTrigger: {
        trigger: triggerTarget,
        start: `top ${Math.round(offset * 100)}%`, // 예: top 85%
        once,
        // markers: true, // 디버그용
      },
      onStart: () => { el.__revealed = true; },
    });
  });
}

export default function GlobalReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // 라우트 변경 시마다 재스캔
    setTimeout(() => {
      initReveal(document);
      ScrollTrigger.refresh();
    }, 0);

    // SPA 전환/동적 콘텐츠 대응 - 이미지 로딩 후 갱신
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
    };
  }, [pathname]);

  return null; // UI 렌더 없음
}