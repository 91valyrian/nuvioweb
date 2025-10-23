// src/components/ColumnsPreview.js
import Link from "next/link";
import Image from "next/image";
import { getAllColumns } from "@/lib/columns";

export default function ColumnsPreview() {
  const posts = getAllColumns().slice(0, 6); // 최신순 상위 6개

  if (!posts.length) return null;

  return (
    <section
      className="py-[120px] md:py-[240px]"
      aria-labelledby="columns-heading"
    >
      <div className="container">
        <div className="flex items-end justify-between mb-[28px]">
          <div>
            <h2 className="section-subtitle text-[50px] leading-[54px] md:text-[40px] md:leading-[44px] font-bold rotate-x-up">
              우리가 만들어온 변화와
              <br /> 성장을 확인하세요.
            </h2>
            <h2
              id="columns-heading"
              className="text-[40px] md:text-[32px] font-bold"
            >
              Columns
            </h2>
            <p className="text-white/60 mt-2 text-[16px]">
              홈페이지 제작, 브랜딩, SEO 인사이트
            </p>
          </div>

          <Link
            href="/columns"
            className="inline-flex items-center gap-2 px-5 h-[44px] rounded-full border border-white/20 text-sm text-white/80 hover:bg-white hover:text-black transition"
            aria-label="컬럼 목록 전체 보기"
          >
            전체 보기
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
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

        <ul className="grid md:grid-cols-3 gap-[32px] md:gap-[40px]">
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
              <h3 className="text-[20px] font-semibold leading-snug line-clamp-2">
                {col.title}
              </h3>
              {col.summary && (
                <p className="text-white/60 text-[14px] mt-2 line-clamp-2">
                  {col.summary}
                </p>
              )}
              <p className="text-white/40 text-[12px] mt-3">{col.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
