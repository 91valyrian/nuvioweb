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
}) {
  const [cursor, setCursor] = useState({ x: 0, y: 0, show: false });
  const rafRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(initialCount, items.length)
  );
  const sentinelRef = useRef(null);
  const listRef = useRef(null);

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
  }, [items.length, step, observeOffset]);

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
            <h4 className="card-title">{item.title}</h4>
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
      {visibleCount < items.length && (
        <li
          ref={sentinelRef}
          className="card-sentinel h-[1px] w-full"
          aria-hidden="true"
        />
      )}
    </ul>
  );
}
