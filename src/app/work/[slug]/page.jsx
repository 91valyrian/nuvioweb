import Image from "next/image";
import { getAllWorks, getWorkBySlug } from "@/lib/works";
import { notFound } from "next/navigation";
import WorkMainSection from "@/components/work/WorkMainSection";
import WorkSubSection from "@/components/work/WorkSubSection";
import WorkExtraSection from "@/components/work/WorkExtraSection";

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

function groupByKeyword(urls = []) {
  const groups = {
    cover: [],
    mainPc: [],
    mainMobile: [],
    subPc: [],
    subMobile: [],
    style: [],
    icons: [],
    admin: [],
    others: [],
  };
  urls.forEach((u) => {
    const path = u.toLowerCase();
    if (path.includes("cover")) groups.cover.push(u);
    else if (path.includes("main-pc")) groups.mainPc.push(u);
    else if (path.includes("main-mobile")) groups.mainMobile.push(u);
    else if (path.includes("sub-pc")) groups.subPc.push(u);
    else if (path.includes("sub-mobile")) groups.subMobile.push(u);
    else if (path.includes("style")) groups.style.push(u);
    else if (path.includes("icon")) groups.icons.push(u);
    else if (path.includes("admin")) groups.admin.push(u);
    else groups.others.push(u);
  });
  return groups;
}

// SEO Meta Tags
export async function generateMetadata({ params }) {
  const slug = params?.slug;
  if (!slug) {
    return { title: "Work | NUVIO", description: "NUVIO 프로젝트 사례" };
  }
  const work = getWorkBySlug(slug);
  if (!work) {
    return { title: "Work | NUVIO", description: "NUVIO 프로젝트 사례" };
  }
  return {
    title: `${work.title} | NUVIO`,
    description: work.overview || "NUVIO 프로젝트 사례",
  };
}

export async function generateStaticParams() {
  const works = getAllWorks();
  return works.map((w) => ({ slug: w.slug }));
}

export default function WorkDetail({ params }) {
  const work = getWorkBySlug(params.slug);
  if (!work) return notFound();

  const urls = extractImages(work.content || "");
  const groups = groupByKeyword(urls);

  return (
    <>
      {/* 헤더 */}
      <div className="container mt-[200px] mb-[50px]">
        <header className="">
          <h2 className="text-[70px] md:text-[100px] font-bold tracking-tight">
            {work.title}
          </h2>
          <p className="text-[28px] md:text-[20px] mt-2 text-neutral-300">
            {work.client} · {work.year}
          </p>
        </header>
      </div>
      {/* 커버 이미지 (frontmatter 우선, 없으면 body에서 cover 키워드 매칭) */}
      {(work.cover || groups.cover[0]) && (
        <div className="mb-12 overflow-hidden">
          <Image
            src={work.cover || groups.cover[0]}
            alt={work.title}
            width={1920}
            height={1080}
            className="w-full h-auto"
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
              <p className="text-[32px] md:text-[24px]">{work.overview}</p>
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

      {/* 메인 페이지 섹션 */}
      <WorkMainSection groups={groups} title={work.title} />

      {/* 서브 페이지 섹션 */}
      <WorkSubSection groups={groups} title={work.title} />

      {/* 부가 콘텐츠: 스타일/아이콘/관리자 */}
      <WorkExtraSection groups={groups} />

      {/* 원문 본문 (HTML로 이미 변환되어 있는 경우에만) */}
      {/* {work.content && (
        <div
          className="prose max-w-none mt-8"
          dangerouslySetInnerHTML={{ __html: work.content }}
        />
      )} */}
    </>
  );
}
