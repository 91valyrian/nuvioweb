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
    "inline-flex items-center justify-center min-w-12 min-h-12 px-4 py-3 rounded-[9999px] border border-white/30 text-base hover:bg-white hover:text-black";
  return (
    <>
      <header className="columns-library-heading">
        <div><span className="columns-library-kicker">NUVIO JOURNAL</span><h2>웹사이트를 위한 좋은 생각들.</h2></div>
        <p>제작을 준비하는 순간부터, 운영의 다음 단계까지.<br />프로젝트에 필요한 이야기를 만나보세요.</p>
      </header>
      <div className="columns-library" id="columns-list">
        <nav
          aria-label="칼럼 주제"
          className="columns-category-bar"
        >
          {["", ...categories].map((cat) => (
            <Link
              key={cat}
              href={columnListUrl(1, cat)}
              aria-current={cat === category ? "page" : undefined}
              className="columns-category rounded-[9999px]"
            >
              {cat || "전체"}
            </Link>
          ))}
        </nav>
        <div className="columns-results-label"><span>{category || "전체 이야기"}</span><span>PAGE {String(page).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}</span></div>
        <ul className="columns-card-grid">
          {visible.map((post) => (
            <li key={post.slug}>
              <Link href={`/columns/${post.slug}`} className="columns-story group block">
                {post.thumbnail && (
                  <div className="columns-story-image relative aspect-video rounded-2xl overflow-hidden">
                    <Image
                      src={post.thumbnail}
                      alt={post.thumbnailAlt || post.title}
                      fill
                      sizes="(min-width: 1600px) 760px, (min-width: 768px) 46vw, 100vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="columns-story-meta"><span>{post.categories?.[0] || "INSIGHT"}</span><time dateTime={post.date}>{post.date}</time></div>
                <h3 className="text-2xl font-semibold leading-snug">
                  {post.title}
                </h3>
                <p className="text-neutral-400 text-lg mt-3 line-clamp-2">
                  {post.summary}
                </p>

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
