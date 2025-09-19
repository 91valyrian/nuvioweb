"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useRef } from "react";


export default function CardList({
  items = [],
  cols = "cols-3",    // cols-2 | cols-3 | cols-4
  gap = "gap-lg",     // gap-sm | gap-lg
  className = "",
}) {
  const [cursor, setCursor] = useState({ x: 0, y: 0, show: false });
  const rafRef = useRef(null);

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

  return (
      <ul className={`card-list ${cols} ${gap} ${className}`}>
        {items.map((item, idx) => (
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
                src={item.cover}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                priority={false}
              />
            </div>

            {/* 내용 */}
            <div className="card-body">
              <h3 className="card-title">{item.title}</h3>
              <p className="card-desc">{item.summary}</p>
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
      </ul>
  );
}