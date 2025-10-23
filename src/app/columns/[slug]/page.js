import { notFound } from "next/navigation";
import { getAllColumns, getColumnBySlug } from "@/lib/columns";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Script from "next/script";
import PrevNextColumns from "@/components/PrevNextColumns";
import Link from "next/link";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://nuvio-web.com"; // canonical 생성에 사용

export async function generateStaticParams() {
  return getAllColumns().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const post = getColumnBySlug(params.slug);
  if (!post) return {};
  const siteName = "nuvio";
  const baseSection = "Columns"; // 다른 페이지들과 유사한 유형
  const seoTitle = `${post.categories} | ${post.title}`;
  const canonical = `${SITE_URL}/columns/${post.slug}`;

  const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean) : [];
  const categories = Array.isArray(post.categories)
    ? post.categories.filter(Boolean)
    : [];

  // 간단한 키워드 믹스(타이틀 키워드 + 카테고리 + 태그)
  const primary = post.title.replace(/\s+/g, " ").trim();
  const mix = [...categories, ...tags].slice(0, 6); // 길이 제한

  // summary가 있으면 우선 사용, 없으면 키워드 조합으로 문장 생성
  const fallbackDesc =
    `${primary} 관련 핵심 전략과 실무 팁을 정리했습니다. ${mix.join(", ")}`.trim();
  const description =
    post.summary && post.summary.length > 40 ? post.summary : fallbackDesc;

  return {
    title: seoTitle,
    description,
    keywords: tags,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      siteName,
      url: canonical,
      title: seoTitle,
      description,
      images: post.cover
        ? [{ url: new URL(post.cover, SITE_URL).toString() }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
      images: post.cover ? [new URL(post.cover, SITE_URL).toString()] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// MDX 커스텀 태그 매핑 (Figure / Figcaption / Img)
const mdxComponents = {
  a: ({ href = "", children, ...props }) => {
    const isInternal = href.startsWith("/");
    if (isInternal) {
      // 내부 링크는 Next.js Link 사용
      return (
        <Link
          href={href}
          {...props}
          className={`text-blue-500 hover:underline ${props.className || ""}`}
        >
          {children}
        </Link>
      );
    }
    // 외부 링크는 새 탭에서 열기
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
        className={`text-blue-500 hover:underline ${props.className || ""}`}
      >
        {children}
      </a>
    );
  },

  // ✅ 커스텀 태그: <Img ... />
  Img: ({ src = "", alt = "", width = 1600, height = 900, className = "" }) => (
    <span className="block relative">
      <Image
        src={src}
        alt={alt || ""}
        width={Number(width)}
        height={Number(height)}
        sizes="(min-width:1280px) 960px, (min-width:768px) 80vw, 100vw"
        className={`w-full h-auto object-cover rounded-2xl ${className}`}
      />
    </span>
  ),

  // ✅ 커스텀 태그: <Figure> ... <Figcaption> ... </Figure>
  Figure: ({ children, className = "" }) => (
    <figure className={`my-[25px] ${className}`}>{children}</figure>
  ),
  Figcaption: ({ children, className = "" }) => (
    <figcaption
      className={`mt-[10px] text-center text-[28px] md:text-[18px] text-black/60 ${className}`}
    >
      {children}
    </figcaption>
  ),

  // ── HTML 태그 fallback (기존 마크다운 이미지/피겨도 정상 작동하도록 유지)
  img: ({ src = "", alt = "", width = 1600, height = 900, className = "" }) => (
    <span className="block relative">
      <Image
        src={src}
        alt={alt || ""}
        width={Number(width)}
        height={Number(height)}
        sizes="(min-width:1280px) 960px, (min-width:768px) 80vw, 100vw"
        className={`w-full h-auto object-cover rounded-2xl ${className}`}
      />
    </span>
  ),
  figure: (props) => (
    <figure {...props} className={`${props.className || ""}`} />
  ),
  figcaption: (props) => (
    <figcaption
      {...props}
      className={`text-center text-neutral-500 ${props.className || ""}`}
    />
  ),
};

export default function ColumnDetail({ params }) {
  const post = getColumnBySlug(params.slug);
  if (!post) return notFound();

  // Article 구조화데이터
  const siteName = "nuvio";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    author: [{ "@type": "Organization", name: post.author || "nuvio" }],
    image: post.cover ? [post.cover] : undefined,
    url: `${SITE_URL}/columns/${post.slug}`,
    publisher: { "@type": "Organization", name: siteName },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/columns/${post.slug}`,
    },
  };

  // prev/next 계산 (최신순 정렬 기준)
  const all = getAllColumns(); // date desc
  const idx = all.findIndex((p) => p.slug === post.slug);
  const prev = all[idx + 1]; // 더 오래된
  const next = all[idx - 1]; // 더 최신

  return (
    <main className="bg-[url('/images/columns/visual.webp')] bg-top bg-no-repeat bg-contain pt-[300px] pb-[180px] md:py-[200px]">
      {/* <SubVisual
        value="Columns"
        image="/images/columns/visual.webp"
        className="!h-[500px] !pt-[200px]"
      /> */}
      <div className="py-[50px] max-w-[1000px] mx-auto bg-[#f8f8f8] px-[30px] md:px-[40px] rounded-[20px] text-black">
        <section className="visual mb-[60px] text-left">
          <h2 className="text-[51px] md:text-[41px] leading-[61px] md:leading-[51px] font-bold">
            {post.title}
          </h2>

          <div className="flex items-center justify-between border-t border-[#ddd] pt-[20px] mt-[20px] text-[18px] md:text-[18px] text-black/60 ">
            {/* {post.author && <span>by {post.author}</span>} <span>·</span> */}
            <p>{post.categories.join(", ")}</p>
            <time dateTime={post.date}>{post.date}</time>
          </div>
        </section>

        {post.thumbnail && (
          <div className="relative mb-[40px] overflow-hidden rounded-[16px]">
            <Image
              src={post.thumbnail}
              alt={post.thumbnailAlt || post.title || ""}
              width={1600}
              height={900}
              className="w-full h-auto object-cover"
              sizes="(min-width:1280px) 1200px, 100vw"
              priority
            />
          </div>
        )}

        <article className="prose prose-invert max-w-none">
          <MDXRemote source={post.content} components={mdxComponents} />
          <hr />
          <p>
            누비오(nuvio)는 ‘예쁜 디자인’보다 ‘성과가 보이는 홈페이지’를
            만듭니다. <br className="hidden md:block" />
            브랜드의 방향성과 업종의 특성을 분석해, 전환율과 효율을 극대화하는
            기획을 제안합니다. <br className="hidden md:block" />
            지금 준비 중이라면, 기획부터 함께 점검하세요. 누비오는 비즈니스
            성장을 설계합니다.
          </p>
          <Link href="/contact" className="text-blue-500 hover:underline">
            👉 홈페이지 제작, 누비오와 함께하기
          </Link>
        </article>

        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="mt-[100px]">
            <ul className="flex flex-wrap gap-2" aria-label="해시태그">
              {post.tags.map((t, i) => (
                <li key={`${t}-${i}`} className="list-none">
                  <span className="inline-flex items-center px-5 md:px-4 h-[60px] md:h-[40px] rounded-full border border-neutral-300 bg-neutral-100 text-neutral-700 text-[28px] md:text-[18px] leading-none hover:bg-neutral-200 transition-colors select-none">
                    #{t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 위/아래 네비 (썸네일+제목+화살표) */}
        <PrevNextColumns
          prev={
            next
              ? {
                  href: `/columns/${next.slug}`,
                  title: next.title,
                  thumb: next.thumbnail || next.cover,
                }
              : null
          }
          next={
            prev
              ? {
                  href: `/columns/${prev.slug}`,
                  title: prev.title,
                  thumb: prev.thumbnail || prev.cover,
                }
              : null
          }
        />

        <div className="flex mt-[30px] mb-[20px]">
          <Link
            href="/columns"
            aria-label="컬럼 목록으로 돌아가기"
            className="inline-flex items-center gap-2 px-6 h-[74px] md:h-[54px] bg-gray-800 text-white text-[30px] md:text-[20px] rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 md:w-6 md:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            목록으로 돌아가기
          </Link>
        </div>
      </div>

      <Script id="ld-article" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
    </main>
  );
}
