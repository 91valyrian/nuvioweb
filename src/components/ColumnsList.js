"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ColumnsList({ posts, categories }) {
  const shouldScrollRef = useRef(false);

  const [active, setActive] = useState("전체");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() => {
    if (active === "전체") return posts;
    return posts.filter((p) => (p.categories || []).includes(active));
  }, [active, posts]);

  // 카테고리 변경 시 페이지를 1로 리셋
  useEffect(() => {
    setPage(1);
  }, [active]);

  // 페이지네이션 계산
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  // 페이지 번호 구성 (최대 7개, ... 생략 표기)
  const pageNumbers = useMemo(() => {
    const arr = [];
    const maxLen = 7;
    if (totalPages <= maxLen) {
      for (let i = 1; i <= totalPages; i++) arr.push(i);
      return arr;
    }
    const left = Math.max(1, safePage - 2);
    const right = Math.min(totalPages, safePage + 2);
    if (left > 1) arr.push(1, "…");
    for (let i = left; i <= right; i++) arr.push(i);
    if (right < totalPages) arr.push("…", totalPages);
    return arr;
  }, [safePage, totalPages]);

  // 페이징/카테고리 버튼을 눌렀을 때만 리스트 상단으로 스크롤
  useEffect(() => {
    if (!shouldScrollRef.current) return; // 버튼으로 트리거된 경우만 동작
    const el = document.getElementById("columns-list");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (typeof history !== "undefined") {
        history.replaceState(null, "", "#columns-list");
      }
    }
    shouldScrollRef.current = false; // 사용 후 리셋
  }, [safePage, active]);

  return (
    <>
      <div
        className="py-[120px] flex flex-col md:flex-row gap-[60px]"
        id="columns-list"
      >
        {/* 카테고리 버튼 */}
        <div className="flex md:shrink-0 flex-wrap content-start w-full md:w-[400px] gap-[10px]">
          {["전체", ...categories].map((cat) => {
            const isOn = active === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  shouldScrollRef.current = true; // 버튼으로 인한 스크롤 트리거
                  setActive(cat);
                  setPage(1);
                }}
                className={[
                  "shrink-0 px-8 h-[64px] md:h-[50px] rounded-[9999px] border-2 text-[30px] md:text-[20px] transition-colors cursor-pointer",
                  isOn
                    ? "border-white bg-white text-black"
                    : "border-white/30 text-white/80 hover:border-white/60 hover:text-white",
                ].join(" ")}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 목록 */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
          {visible.map((col) => (
            <li key={col.slug} className="group relative">
              <Link
                href={`/columns/${col.slug}`}
                className="absolute inset-0 z-10"
                aria-label={`${col.title} 자세히 보기`}
              />

              {col.thumbnail && (
                <div className="relative aspect-[16/9] mb-[16px] overflow-hidden rounded-[16px]">
                  <Image
                    src={col.thumbnail}
                    alt={col.thumbnailAlt || col.title || ""}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <h3
                href={`/columns/${col.slug}`}
                className="block truncate text-[34px] md:text-[24px] font-semibold leading-snug hover:text-white transition-colors "
              >
                {col.title}
              </h3>

              {col.summary && (
                <p className="text-neutral-400 text-[28px] md:text-[18px] mt-[10px] leading-relaxed line-clamp-2">
                  {col.summary}
                </p>
              )}

              {/* <div className="mt-2 flex flex-wrap items-center gap-2">
              {Array.isArray(col.categories) &&
                col.categories.map((c) => (
                  <span
                    key={c}
                    className="text-[15px] px-3 py-2 rounded-[9999px] border border-white/20 text-white/70"
                  >
                    {c}
                  </span>
                ))}
            </div> */}

              <p className="text-neutral-500 text-[26px] md:text-[16px] mt-[15px]">
                {col.date}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* 페이지 정보 */}
      {/* <div className="mt-6 text-center text-white/60 text-sm">
        총 {filtered.length}건 · {safePage}/{totalPages}페이지
      </div> */}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <nav
          className="mt-6 flex items-center justify-center gap-2"
          aria-label="페이지네이션"
        >
          <button
            onClick={() => {
              shouldScrollRef.current = true;
              setPage((p) => Math.max(1, p - 1));
            }}
            disabled={safePage <= 1}
            className="px-3 h-[64px] md:h-[50px] rounded-[9999px] border-2 border-white/20 text-[30px] md:text-[20px] text-white/80 hover:bg-white hover:text-black disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white/80 transition cursor-pointer"
          >
            이전
          </button>

          {pageNumbers.map((n, idx) =>
            n === "…" ? (
              <span key={`gap-${idx}`} className="px-2 text-white/40">
                …
              </span>
            ) : (
              <button
                key={`p-${n}`}
                onClick={() => {
                  shouldScrollRef.current = true;
                  setPage(n);
                }}
                aria-current={n === safePage ? "page" : undefined}
                className={[
                  "w-[64px] md:w-[50px] h-[64px] md:h-[50px] text-[30px] md:text-[20px] rounded-[9999px] border-2 transition cursor-pointer",
                  n === safePage
                    ? "border-main bg-main text-white"
                    : "border-white/20 text-white/80 hover:bg-white hover:text-black",
                ].join(" ")}
              >
                {n}
              </button>
            )
          )}

          <button
            onClick={() => {
              shouldScrollRef.current = true;
              setPage((p) => Math.min(totalPages, p + 1));
            }}
            disabled={safePage >= totalPages}
            className="px-3 h-[64px] md:h-[50px] rounded-[9999px] border-2 border-white/20 text-[30px] md:text-[20px] text-white/80 hover:bg-white hover:text-black disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white/80 transition cursor-pointer"
          >
            다음
          </button>
        </nav>
      )}
    </>
  );
}
