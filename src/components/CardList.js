"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useRef, useEffect } from "react";

export default function CardList({
  items = [],
  cols = "cols-3", // cols-2 | cols-3 | cols-4
  gap = "gap-sm", // gap-sm | gap-lg
  className = "",
  initialCount = 6, // 처음 보여줄 카드 개수
  step = 3, // 추가 로드 개수
  observeOffset = "200px", // 마지막 근처에서 미리 로드할 margin
  loadMode = "auto", // 'auto' | 'button'
  moreLabel = "더보기", // 버튼 모드 레이블
  moreHoverLabel, // 버튼 hover 시 문구(미지정 시 moreLabel 사용)
}) {
  const [cursor, setCursor] = useState({ x: 0, y: 0, show: false });
  const rafRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(initialCount, items.length)
  );
  const sentinelRef = useRef(null);
  const listRef = useRef(null);
  const resolvedHoverLabel = moreHoverLabel || moreLabel;

  useEffect(() => {
    setVisibleCount(Math.min(initialCount, items.length));
  }, [items, initialCount]);

  const handleEnter = useCallback(() => {
    setCursor((c) => ({ ...c, show: true }));
  }, []);

  const handleLeave = useCallback(() => {
    setCursor((c) => ({ ...c, show: false }));
  }, []);

  const handleMove = useCallback((e) => {
    if (rafRef.current) return;
    const x = e.clientX;
    const y = e.clientY;
    rafRef.current = requestAnimationFrame(() => {
      setCursor({ x, y, show: true });
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    if (loadMode !== "auto" || step <= 0) return;
    if (!sentinelRef.current) return;

    const node = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisibleCount((prev) => {
            if (prev >= items.length) return prev;
            return Math.min(prev + step, items.length);
          });
        }
      },
      { root: null, rootMargin: observeOffset, threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, [items.length, step, observeOffset, loadMode]);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;

    // Find newly added cards that have data-reveal but are not prepared yet
    const targets = Array.from(
      root.querySelectorAll("li[data-reveal]:not([data-reveal-ready])")
    );
    if (targets.length === 0) return;

    // Prepare initial hidden state and mark as ready to avoid duplicate work
    targets.forEach((el) => {
      el.setAttribute("data-reveal-ready", "1");
      // If global CSS already handles hidden state, skip inline styles
      // But to be safe, ensure it's hidden before reveal
      el.style.opacity = el.style.opacity || "0";
      if (!el.style.transform) {
        const type = el.getAttribute("data-reveal");
        if (type === "fade-up") el.style.transform = "translateY(12px)";
      }
    });

    // Observe and reveal when intersecting
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseFloat(el.getAttribute("data-reveal-delay") || "0");
          // transition only once
          el.style.transition =
            el.style.transition || "opacity 500ms ease, transform 500ms ease";
          setTimeout(
            () => {
              el.style.opacity = "1";
              el.style.transform = "none";
              io.unobserve(el);
            },
            Math.max(0, delay * 1000)
          );
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [visibleCount]);

  return (
    <ul ref={listRef} className={`card-list ${cols} ${gap} ${className}`}>
      {items.slice(0, visibleCount).map((item, idx) => (
        <li
          key={`${item.slug}-${idx}`}
          className="card group overflow-hidden"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          onMouseMove={handleMove}
          data-reveal="fade-up"
          data-reveal-delay="0.2"
        >
          {/* 썸네일 */}
          <div className="card-media">
            <Image
              src={item.thumbnail || "/images/work/placeholder-thum.png"}
              alt={item.title}
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              style={{ objectFit: "cover" }}
              quality={90}
              priority={false}
            />
          </div>

          {/* 내용 */}
          <div className="card-body">
            <h3 className="card-title">{item.title}</h3>
            <p className="card-desc line-clamp-2">{item.summary}</p>
            <p className="card-meta">
              {item.client} · {item.year}
            </p>
          </div>

          {/* 전체 링크 */}
          <Link
            href={`/work/${item.slug}`}
            className="card-link"
            aria-label={`${item.title} 상세보기`}
          />
        </li>
      ))}
      {/* 무한 스크롤 센티넬 */}
      {loadMode === "auto" && visibleCount < items.length && (
        <li
          ref={sentinelRef}
          className="card-sentinel h-[1px] w-full"
          aria-hidden="true"
        />
      )}
      {loadMode === "button" && visibleCount < items.length && (
        <li className="col-span-full flex justify-center mt-[24px] mb-[30px]">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((prev) => Math.min(prev + step, items.length))
            }
            className="relative group block w-[400px] md:w-[290px] h-[74px] md:h-[54px] cursor-pointer mx-auto bg-white text-[#090A0C] text-[14px] font-pretendard rounded-[9999px] shadow-[0_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 overflow-hidden before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[calc(100%+15px)] before:h-[calc(100%+15px)] before:bg-[rgba(255,255,255,0.12)] before:rounded-[30px] before:shadow-[0_24px_90px_rgba(0,0,0,0.12)] before:-z-[1] z-[998] hover:bg-main hover:text-white"
            aria-label={`${moreLabel} (${visibleCount}/${items.length})`}
          >
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full overflow-hidden">
              <span className="flex items-center justify-center text-[28px] md:text-[18px] font-semibold h-full transform translate-y-0 transition-transform duration-200 group-hover:-translate-y-[100%]">
                {moreLabel}
              </span>
              <span className="flex items-center justify-center text-[34px] md:text-[24px] font-bold h-full text-white transform translate-y-0 transition-transform duration-200 group-hover:translate-y-[-100%]">
                {resolvedHoverLabel}
              </span>
            </span>
          </button>
        </li>
      )}
    </ul>
  );
}
