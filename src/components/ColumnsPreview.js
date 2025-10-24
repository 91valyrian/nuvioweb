// src/components/ColumnsPreview.js
import Link from "next/link";
import Image from "next/image";
import { getAllColumns } from "@/lib/columns";

export default function ColumnsPreview() {
  const posts = getAllColumns().slice(0, 6); // 최신순 상위 6개

  if (!posts.length) return null;

  return (
    <section
      className="py-[240px] md:py-[200px]"
      aria-labelledby="columns-heading"
    >
      <div className="container">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-[60px] md:mb-[50px] gap-[30px]">
          <div>
            <h2 className="section-subtitle text-[54px] leading-[60px] md:text-[44px] md:leading-[50px] font-bold rotate-x-up">
              {/* 성공적인 홈페이지 제작을 위한 실전 노하우와 SEO 전략 */}
              홈페이지 제작,
              <br />
              성공한 기업들은 무엇이 달랐을까?
            </h2>
            <p className="text-white/60 mt-[20px] text-[30px] md:text-[20px] rotate-x-up">
              누비오는 브랜드의 목적에 맞춘 완성도 높은 홈페이지 제작 솔루션을
              제공합니다.
            </p>
          </div>

          <Link
            href="/columns"
            className="inline-flex items-center gap-2 px-8 md:px-5 h-[74px] md:h-[54px] rounded-full border-1 border-white/20 text-[28px] md:text-[18px] text-white/80 hover:bg-white hover:text-black transition fade-up"
            aria-label="컬럼 목록 전체 보기"
          >
            홈페이지 컬럼 보러가기
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 md:w-4 md:h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M5 12h14M13 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-[32px] md:gap-[40px] fade-up">
          {posts.map((col, i) => (
            <li key={`${col.slug}-${i}`} className="group relative">
              <Link
                href={`/columns/${col.slug}`}
                className="absolute inset-0 z-10"
                aria-label={`${col.title} 자세히 보기`}
              />
              {(col.thumbnail || col.cover) && (
                <div className="relative aspect-[16/9] mb-[14px] overflow-hidden rounded-[16px]">
                  <Image
                    src={col.thumbnail || col.cover}
                    alt={col.thumbnailAlt || col.title || ""}
                    fill
                    sizes="(min-width:1280px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={false}
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
              <p className="text-neutral-500 text-[26px] md:text-[16px] mt-[15px]">
                {col.date}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
