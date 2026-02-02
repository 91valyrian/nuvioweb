import Image from "next/image";
import { getAllWorks, getWorkBySlug } from "@/lib/works";
import { notFound } from "next/navigation";
import WorkMainSection from "@/components/work/WorkMainSection";

// HTML 태그 제거 및 공백 정리
function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// HTML 정리(특수공백 포함) + 문장 단위 트렁케이트
function cleanText(html = "") {
  return stripHtml(html)
    .replace(/&nbsp;/g, " ")
    .trim();
}

function truncateSentence(text = "", maxLength = 110) {
  if (text.length <= maxLength) return text;
  const trimmed = text.slice(0, maxLength);

  // 한글 문장 마침(다.), 일반 마침표, 물음표, 느낌표 중 가장 마지막 위치를 찾는다.
  const lastKoPeriod = trimmed.lastIndexOf("다.");
  const lastPeriod = trimmed.lastIndexOf(".");
  const lastQ = trimmed.lastIndexOf("?");
  const lastE = trimmed.lastIndexOf("!");

  let cut = Math.max(lastKoPeriod, lastPeriod, lastQ, lastE);

  // "다."는 2글자이므로 길이 보정
  if (cut === lastKoPeriod && cut !== -1) {
    return trimmed.slice(0, cut + 2);
  }

  if (cut > 0) {
    return trimmed.slice(0, cut + 1);
  }

  // 마침표류가 없으면 단어 경계에서 자르고 말줄임표 처리
  const lastSpace = trimmed.lastIndexOf(" ");
  return lastSpace > 0 ? trimmed.slice(0, lastSpace) + "…" : trimmed + "…";
}

// OG 이미지 선택 우선순위: cover > 본문 첫 이미지 > 기본 OG
function selectOgImage(work) {
  if (work?.cover) return work.cover;
  if (work?.content) {
    const m = work.content.match(/!\[[^\]]*\]\(([^)]+)\)/);
    if (m && m[1]) return m[1];
  }
  return "/og/og-default.png";
}

// 간단한 마크다운 이미지 추출: ![alt](src)
function extractImages(markdown = "") {
  const re = /!\[[^\]]*\]\(([^)]+)\)/g; // 캡처: (src)
  const urls = [];
  let m;
  while ((m = re.exec(markdown))) {
    urls.push(m[1]);
  }
  return urls;
}

// SEO Meta Tags (상위 노출 최적화: 제목/설명/키워드/OG/Twitter/robots/canonical)
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com";

  // 공통 기본값
  const fallbackTitle =
    "홈페이지 제작 사례 | 디자인과 SEO 성과로 증명하는 nuvio";
  const fallbackDesc =
    "디자인 감각과 SEO 성과로 완성한 nuvio의 프로젝트 사례. 기획부터 운영까지, 브랜드의 성장 여정을 함께 설계했습니다.";
  const fallbackUrl = `${base}/work`;
  const fallbackImage = "/og/og-default.png";
  const fallbackKeywords = [
    "포트폴리오",
    "웹사이트 제작",
    "홈페이지 제작",
    "기업 홈페이지 제작",
    "브랜드 홈페이지",
    "SEO 홈페이지 제작",
    "사례",
    "리뉴얼",
    "UI/UX",
    "nuvio",
  ];

  // ❶ slug가 없을 때
  if (!slug) {
    return {
      title: fallbackTitle,
      description: fallbackDesc,
      keywords: fallbackKeywords,
      alternates: { canonical: fallbackUrl },
      openGraph: {
        type: "website",
        siteName: "nuvio",
        title: fallbackTitle,
        description: fallbackDesc,
        url: fallbackUrl,
        images: [{ url: fallbackImage }],
        locale: "ko_KR",
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDesc,
        images: [fallbackImage],
      },
      robots: { index: true, follow: true },
    };
  }

  const work = getWorkBySlug(slug);

  // ❷ slug 데이터가 없을 때
  if (!work) {
    return {
      title: fallbackTitle,
      description: fallbackDesc,
      keywords: fallbackKeywords,
      alternates: { canonical: fallbackUrl },
      openGraph: {
        type: "website",
        siteName: "nuvio",
        title: fallbackTitle,
        description: fallbackDesc,
        url: fallbackUrl,
        images: [{ url: fallbackImage }],
        locale: "ko_KR",
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDesc,
        images: [fallbackImage],
      },
      robots: { index: true, follow: true },
    };
  }

  // ❸ 데이터가 있을 때 (페이지별 맞춤 메타)
  // const pageTitle = `[${work.client || "브랜드"}][${work.summary}] 홈페이지 제작 사례 - ${work.seoTitle}`;
  const pageTitle = work.seoTitle
    ? `${work.seoTitle}`
    : `[${work.summary}] ${work.client} 홈페이지 제작 사례`;
  // CTR형 설명: 문제→해결 + 핵심키워드 자연 삽입 (120자 내)
  const rawDesc =
    work.overview ||
    work.excerpt ||
    `[${work.client || "브랜드"}][${work.summary}] 홈페이지 제작 사례`;
  // const descLead = `${work.seoDesc}`; //truncateSentence(cleanText(rawDesc), 110);
  // seoDesc가 없을 경우를 대비한 Fallback 로직
  const descLead = work.seoDesc
    ? work.seoDesc
    : `${work.client}의 ${work.summary} 홈페이지 제작 사례입니다. 업종별 특화된 구조와 SEO 설계를 지금 확인해 보세요.`;
  const pageDesc = `${descLead}`;
  const url = `${base}/work/${slug}`;
  const ogImage = selectOgImage(work);
  const svc = Array.isArray(work.service) ? work.service : [];
  const keywords = Array.isArray(work.seoKeywords) ? work.seoKeywords : [];
  const pageKeywords = [work.client, ...keywords].filter(Boolean);

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: pageKeywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: "nuvio",
      title: pageTitle,
      description: pageDesc,
      url,
      images: [{ url: ogImage }],
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export async function generateStaticParams() {
  const works = getAllWorks();
  return works.map((w) => ({ slug: w.slug }));
}

export default async function WorkDetail({ params }) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) return notFound();

  const images = extractImages(work.content || "");

  return (
    <>
      {/* 헤더 */}
      <div className="container mt-[200px] mb-[50px]">
        <header className="">
          <h1
            className="text-[70px] md:text-[100px] font-bold tracking-tight"
            dangerouslySetInnerHTML={{ __html: work.title }}
          />
          <p className="text-[28px] md:text-[20px] mt-2 text-neutral-300">
            {work.client} · {work.year}
          </p>
        </header>
      </div>
      {/* 커버 이미지 (frontmatter 우선) */}
      {work.cover && (
        <div className="mb-12 overflow-hidden">
          <Image
            src={work.cover}
            alt={"Cover image for " + work.seoTitle}
            width={1920}
            height={720}
            className="object-cover mx-auto w-full h-[720px] max-w-[1920px]"
            priority
          />
        </div>
      )}

      <article className="container py-12 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[50px] md:gap-0 text-center md:text-left md:pb-40 text-left">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[50px] md:gap-0 ">
            <div className="">
              <p className="text-[28px] md:text-[20px] rounded-[10px] py-[7px] px-[20px] mb-[10px] border border-solid border-neutral-400 text-neutral-400 inline-block">
                Client
              </p>
              <p className="text-[32px] md:text-[24px]">{work.client}</p>
            </div>

            <div className="">
              <p className="text-[28px] md:text-[20px] rounded-[10px] py-[7px] px-[20px] mb-[10px] border border-solid border-neutral-400 text-neutral-400 inline-block">
                Service
              </p>
              {work.service && work.service.length > 0 && (
                <ul className="flex flex-col gap-[10px] text-[32px] md:text-[24px]">
                  {work.service.map((srv, i) => (
                    <li key={`service-${i}`}>{srv}</li>
                  ))}
                </ul>
              )}
            </div>

            <div aria-hidden="true" className="hidden md:block" />
          </div>

          <div className="">
            <p className="text-[28px] md:text-[20px] rounded-[10px] py-[7px] px-[20px] mb-[10px] border border-solid border-neutral-400 text-neutral-400 inline-block">
              Overview
            </p>
            {/* 요약 */}
            {work.overview && (
              <p
                className="text-[32px] md:text-[24px]"
                dangerouslySetInnerHTML={{ __html: work.overview }}
              />
            )}

            <a
              href={work.href}
              target="_blank"
              className="text-[32px] md:text-[24px] mt-[30px] underline block"
            >
              Visit Website
            </a>
          </div>
        </div>
      </article>

      {/* 디자인 이미지 섹션 */}
      <WorkMainSection images={images} title={work.seoTitle} />

      {/* 구조화 데이터(JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: work.title,
            url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://nuvio-web.com"}/work/${work.slug}`,
            author: { "@type": "Organization", name: "nuvio" },
            datePublished: work.inputDate || work.year,
            description: stripHtml(work.overview || ""),
            image: selectOgImage(work),
            inLanguage: "ko",
          }),
        }}
      />

      {/* 이전 / 다음 포폴 네비게이션 (inputDate 최신순 기준) */}
      {(() => {
        // 최신순(내림차순)으로 정렬한 목록 기준으로 prev/next 계산
        const works = getAllWorks().sort(
          (a, b) => new Date(b.inputDate) - new Date(a.inputDate),
        );
        const currentIndex = works.findIndex((w) => w.slug === work.slug);
        if (currentIndex === -1) return null;

        // 최신순 배열에서: prev(이전)는 더 오래된 것, next(다음)는 더 최신 것
        const prevWork = works[currentIndex - 1];
        const nextWork = works[currentIndex + 1];

        // 둘 다 없으면 렌더링 생략
        if (!prevWork && !nextWork) return null;

        return (
          <nav className="container py-[150px] flex justify-between items-center border-t border-neutral-800 mt-[120px]">
            {/* 이전 포폴 (오래된) */}
            {prevWork ? (
              <a
                href={`/work/${prevWork.slug}`}
                className="text-[44px] md:text-[40px] text-neutral-400 hover:text-white transition-colors"
              >
                ← {prevWork.seoTitle}
              </a>
            ) : (
              <div />
            )}

            {/* 다음 포폴 (더 최신) */}
            {nextWork ? (
              <a
                href={`/work/${nextWork.slug}`}
                className="text-[44px] md:text-[40px] text-neutral-400 hover:text-white transition-colors"
              >
                {nextWork.seoTitle} →
              </a>
            ) : (
              <div />
            )}
          </nav>
        );
      })()}
    </>
  );
}
