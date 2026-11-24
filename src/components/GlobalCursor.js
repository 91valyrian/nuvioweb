"use client";

import { useEffect, useRef } from "react";

export default function GlobalCursor() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = -1000, y = -1000, scale = 1, frame;
    el.style.display = "block";
    const draw = () => {
      frame = null;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const interactive = node => node?.closest?.('a,button,input,textarea,label,[role="button"],.cursor-boost');
    const move = event => { x = event.clientX; y = event.clientY; schedule(); };
    const over = event => {
      if (!interactive(event.relatedTarget) && interactive(event.target)) { scale = 4; schedule(); }
    };
    const out = event => {
      if (interactive(event.target) && !interactive(event.relatedTarget)) { scale = 1; schedule(); }
    };
    const leave = () => { x = -1000; y = -1000; scale = 1; schedule(); };
    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("pointerover", over, true);
    document.addEventListener("pointerout", out, true);
    window.addEventListener("mouseleave", leave);
    document.documentElement.classList.add("cursor-none");
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("pointerover", over, true);
      document.removeEventListener("pointerout", out, true);
      window.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);
  return <div ref={ref} aria-hidden="true" className="fixed left-0 top-0 z-[9999] pointer-events-none select-none rounded-[9999px] mix-blend-difference bg-white"
    style={{ display: "none", width: 30, height: 30, transform: "translate3d(-1000px,-1000px,0)", transition: "transform 150ms cubic-bezier(.215,.61,.355,1)", willChange: "transform" }} />;
}
