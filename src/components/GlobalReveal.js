"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GlobalReveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animations = [];
    const originals = new Map();
    const observers = [];
    let active = true;
    let coverContext;

    for (const [selector, margin, transform] of [
      [".fade-up", "-15%", "translateY(40px)"],
      [".rotate-x-up", "-5%", "translateY(40px) rotateX(90deg)"],
    ]) {
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          el.style.opacity = originals.get(el);
          animations.push(el.animate([
            { opacity: 0, transform },
            { opacity: 1, transform: "none" },
          ], { duration: 800, easing: "cubic-bezier(0.215, 0.61, 0.355, 1)" }));
          observer.unobserve(el);
        }
      }, { rootMargin: `0px 0px ${margin} 0px` });
      for (const el of document.querySelectorAll(selector)) {
        originals.set(el, el.style.opacity);
        el.style.opacity = "0";
        observer.observe(el);
      }
      observers.push(observer);
    }

    // Only the cover's scrub/pin behavior needs layout-aware ScrollTrigger.
    // Ordinary reveal effects use the compositor, without per-element geometry reads.
    if (document.querySelector(".cover")) {
      Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
        if (!active) return;
        gsap.registerPlugin(ScrollTrigger);
        coverContext = gsap.context(() => {
          gsap.to(".cover", {
            y: -100, width: "100%", borderRadius: 0,
            scrollTrigger: {
              trigger: ".cover",
              start: () => window.matchMedia("(min-width: 769px)").matches ? "top top" : "top 20%",
              end: "bottom top", scrub: true,
            },
          });
        });
      });
    }
    return () => {
      active = false;
      observers.forEach(observer => observer.disconnect());
      animations.forEach(animation => animation.cancel());
      originals.forEach((opacity, el) => { el.style.opacity = opacity; });
      coverContext?.revert();
    };
  }, [pathname]);
  return null;
}
