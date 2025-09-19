"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function GlobalCursor() {
  const ref = useRef(null);
  const qx = useRef(null);
  const qy = useRef(null);
  const qw = useRef(null);
  const qh = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 초기 상태: 중심 정렬 + 기본 크기 30x30
    gsap.set(el, {
      x: -1000,
      y: -1000,
      xPercent: -50,
      yPercent: -50,
      width: 30,
      height: 30,
      opacity: 1,
      force3D: true,
    });

    // 부드러운 이동/사이즈 변경
    qx.current = gsap.quickTo(el, "x", { duration: 0.15, ease: "power3.out" });
    qy.current = gsap.quickTo(el, "y", { duration: 0.15, ease: "power3.out" });
    qw.current = gsap.quickTo(el, "width", { duration: 0.2, ease: "power3.out" });
    qh.current = gsap.quickTo(el, "height", { duration: 0.2, ease: "power3.out" });

    const move = (e) => {
      qx.current?.(e.clientX);
      qy.current?.(e.clientY);
    };

    // 인터랙티브 타겟 정의
    const interactiveSelector = [
      "a",
      "button",
      "input[type=button]",
      "input[type=submit]",
      "[role=button]",
      ".cursor-boost",
    ].join(",");

    const isInteractive = (node) => node?.closest?.(interactiveSelector);

    // 진입/완전 이탈만 반영 (relatedTarget)
    const onOver = (e) => {
      const from = e.relatedTarget;
      const to = e.target;
      if (!isInteractive(from) && isInteractive(to)) {
        qw.current?.(120);
        qh.current?.(120);
      }
    };
    const onOut = (e) => {
      const from = e.target;
      const to = e.relatedTarget;
      if (isInteractive(from) && !isInteractive(to)) {
        qw.current?.(30);
        qh.current?.(30);
      }
    };

    // 터치 환경은 숨김
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!isTouch) {
      window.addEventListener("mousemove", move, { passive: true });
      document.addEventListener("pointerover", onOver, true);
      document.addEventListener("pointerout", onOut, true);
      document.documentElement.classList.add("cursor-none");
    } else {
      el.style.display = "none";
    }

    const leaveWindow = () => {
      qx.current?.(-1000);
      qy.current?.(-1000);
      qw.current?.(30);
      qh.current?.(30);
    };
    window.addEventListener("mouseleave", leaveWindow);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
      window.removeEventListener("mouseleave", leaveWindow);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={[
        "fixed left-0 top-0 z-[9999]",
        "pointer-events-none select-none rounded-full",
        "mix-blend-difference bg-white",
      ].join(" ")}
      style={{ willChange: "transform,width,height" }}
    />
  );
}