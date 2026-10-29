import Image from "next/image";
import Link from "next/link";
import { columnListUrl } from "@/lib/column-pagination";
export default function ColumnsList({
  visible,
  categories,
  category,
  page,
  totalPages,
}) {
  const navClass =
    "inline-flex items-center justify-center min-w-12 min-h-12 px-4 py-3 rounded-full border border-white/30 text-base hover:bg-white hover:text-black";
  return (
    <>
      <h2 className="sr-only">홈페이지 제작 칼럼 목록</h2>
      <div className="py-16 flex flex-col md:flex-row gap-10" id="columns-list">
        <nav
          aria-label="칼럼 주제"
          className="md:w-[240px] shrink-0 flex flex-wrap content-start gap-3"
        >
          {["", ...categories].map((cat) => (
            <Link
              key={cat}
              href={columnListUrl(1, cat)}
              aria-current={cat === category ? "page" : undefined}
              className={`${navClass} ${cat === category ? "bg-white text-black" : ""}`}
            >
              {cat || "전체"}
            </Link>
          ))}
        </nav>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 min-w-0 flex-1">
          {visible.map((post) => (
            <li key={post.slug}>
              <Link href={`/columns/${post.slug}`} className="group block">
                {post.thumbnail && (
                  <div className="relative aspect-video mb-4 rounded-2xl overflow-hidden">
                    <Image
                      src={post.thumbnail}
                      alt={post.thumbnailAlt || post.title}
                      fill
                      sizes="(min-width: 1280px) 600px, (min-width: 768px) 45vw, 100vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="text-2xl font-semibold leading-snug group-hover:underline">
                  {post.title}
                </h3>
                <p className="text-neutral-400 text-lg mt-3 line-clamp-2">
                  {post.summary}
                </p>
                <time
                  dateTime={post.date}
                  className="block text-neutral-500 text-base mt-3"
                >
                  {post.date}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {totalPages > 1 && (
        <nav
          aria-label="칼럼 페이지"
          className="flex flex-wrap justify-center gap-3"
        >
          {page > 1 && (
            <Link className={navClass} href={columnListUrl(page - 1, category)}>
              이전
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={columnListUrl(n, category)}
              aria-current={n === page ? "page" : undefined}
              className={`${navClass} ${n === page ? "bg-main text-white" : ""}`}
            >
              {n}
            </Link>
          ))}
          {page < totalPages && (
            <Link className={navClass} href={columnListUrl(page + 1, category)}>
              다음
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
