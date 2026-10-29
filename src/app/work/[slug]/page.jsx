import ServiceLinks from "@/components/ServiceLinks";
import {
  SITE_URL,
  indexableRobots,
  validDate,
  absoluteUrl,
  pageMetadata,
} from "@/lib/site";
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

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();
  const title = work.seoTitle || `${work.client} 홈페이지 제작 사례`;
  const description =
    work.seoDesc ||
    stripHtml(work.overview || `${work.client}의 홈페이지 제작 사례입니다.`);
  return {
    ...pageMetadata({
      title,
      description,
      path: `/work/${slug}`,
      image: selectOgImage(work),
      type: "article",
    }),
    keywords: work.seoKeywords || [],
    robots: indexableRobots,
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
            sizes="100vw"
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

      <div className="container">
        <ServiceLinks
          title={work.seoTitle || work.summary}
          tags={work.seoKeywords || []}
        />
      </div>

      <section className="container py-12 max-w-[1100px]">
        <h2 className="text-3xl font-bold mb-5">프로젝트의 제작 방향</h2>
        <p className="text-xl leading-relaxed text-neutral-300">
          {work.seoDesc || stripHtml(work.overview)}
        </p>
        <p className="text-lg leading-relaxed text-neutral-400 mt-5">
          브랜드의 소개와 서비스 정보를 어떤 순서로 전달하는지 아래의 공개
          화면에서 살펴보세요. 비슷한 프로젝트를 준비한다면 필요한 메뉴와 운영
          기능을 정리해 상담할 수 있습니다.
        </p>
      </section>

      {/* 디자인 이미지 섹션 */}
      <WorkMainSection images={images} title={work.seoTitle} />

      {/* 구조화 데이터(JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: stripHtml(work.title),
            url: `${SITE_URL}/work/${work.slug}`,
            author: { "@type": "Organization", name: "nuvio" },
            datePublished: validDate(work.inputDate),
            description: stripHtml(work.overview || ""),
            image: absoluteUrl(selectOgImage(work)),
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
