import Image from "next/image";
import { getAllWorks, getWorkBySlug } from "@/lib/works";
import { notFound } from "next/navigation";

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
            <h1 className="text-[70px] md:text-[100px] font-bold tracking-tight">{work.title}</h1>
            <p className="text-[28px] md:text-[20px] mt-2 text-neutral-500">{work.client} · {work.year}</p>
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

      <article className="container py-12 md:mt-[-150px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[50px] md:gap-0 text-center md:text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[50px] md:gap-0 text-center md:text-left">
              <div className="">
              <p className="text-[28px] md:text-[20px] rounded-[10px] py-[7px] px-[20px] mb-[10px] border border-solid border-neutral-400 text-neutral-400 inline-block">Client</p>
              <p className="text-[32px] md:text-[24px]">{work.client}</p>
            </div>

            <div className="">
              <p className="text-[28px] md:text-[20px] rounded-[10px] py-[7px] px-[20px] mb-[10px] border border-solid border-neutral-400 text-neutral-400 inline-block">Service</p>
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
            <p className="text-[28px] md:text-[20px] rounded-[10px] py-[7px] px-[20px] mb-[10px] border border-solid border-neutral-400 text-neutral-400 inline-block">Overview</p>
            {/* 요약 */}
            {work.summary && (
              <p className="text-[32px] md:text-[24px]">{work.summary}</p>
            )}
          </div>
        </div>
        

        

        {/* 메인 페이지 섹션 */}
        {(groups.mainPc.length || groups.mainMobile.length) ? (
          <section className="mb-14">
            <h2 className="mb-6 text-2xl md:text-3xl font-semibold">메인 페이지</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.mainPc.map((src, i) => (
                <figure key={`main-pc-${i}`} className="rounded-xl overflow-hidden bg-neutral-50">
                  <Image src={src} alt="메인 PC" width={1600} height={1000} className="w-full h-auto" />
                  <figcaption className="px-4 py-3 text-sm text-neutral-600">Main · PC</figcaption>
                </figure>
              ))}
              {groups.mainMobile.map((src, i) => (
                <figure key={`main-mo-${i}`} className="rounded-xl overflow-hidden bg-neutral-50">
                  <Image src={src} alt="메인 Mobile" width={800} height={1600} className="w-full h-auto" />
                  <figcaption className="px-4 py-3 text-sm text-neutral-600">Main · Mobile</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* 서브 페이지 섹션 */}
        {(groups.subPc.length || groups.subMobile.length) ? (
          <section className="mb-14">
            <h2 className="mb-6 text-2xl md:text-3xl font-semibold">서브 페이지</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.subPc.map((src, i) => (
                <figure key={`sub-pc-${i}`} className="rounded-xl overflow-hidden bg-neutral-50">
                  <Image src={src} alt="서브 PC" width={1600} height={1000} className="w-full h-auto" />
                  <figcaption className="px-4 py-3 text-sm text-neutral-600">Sub · PC</figcaption>
                </figure>
              ))}
              {groups.subMobile.map((src, i) => (
                <figure key={`sub-mo-${i}`} className="rounded-xl overflow-hidden bg-neutral-50">
                  <Image src={src} alt="서브 Mobile" width={800} height={1600} className="w-full h-auto" />
                  <figcaption className="px-4 py-3 text-sm text-neutral-600">Sub · Mobile</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* 부가 콘텐츠: 스타일/아이콘/관리자 */}
        {(groups.style.length || groups.icons.length || groups.admin.length) ? (
          <section className="mb-16">
            <h2 className="mb-6 text-2xl md:text-3xl font-semibold">부가 콘텐츠</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {groups.style.map((src, i) => (
                <figure key={`style-${i}`} className="rounded-xl overflow-hidden bg-neutral-50">
                  <Image src={src} alt="스타일 가이드" width={1200} height={800} className="w-full h-auto" />
                  <figcaption className="px-4 py-3 text-sm text-neutral-600">Style Guide</figcaption>
                </figure>
              ))}
              {groups.icons.map((src, i) => (
                <figure key={`icons-${i}`} className="rounded-xl overflow-hidden bg-neutral-50">
                  <Image src={src} alt="아이콘 세트" width={1200} height={800} className="w-full h-auto" />
                  <figcaption className="px-4 py-3 text-sm text-neutral-600">Icons</figcaption>
                </figure>
              ))}
              {groups.admin.map((src, i) => (
                <figure key={`admin-${i}`} className="rounded-xl overflow-hidden bg-neutral-50">
                  <Image src={src} alt="관리자 페이지" width={1200} height={800} className="w-full h-auto" />
                  <figcaption className="px-4 py-3 text-sm text-neutral-600">Admin</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* 나머지 이미지(분류 불가) */}
        {groups.others.length ? (
          <section className="mb-16">
            <h2 className="mb-6 text-2xl md:text-3xl font-semibold">기타 이미지</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.others.map((src, i) => (
                <figure key={`others-${i}`} className="rounded-xl overflow-hidden bg-neutral-50">
                  <Image src={src} alt="프로젝트 이미지" width={1400} height={900} className="w-full h-auto" />
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* 원문 본문 (HTML로 이미 변환되어 있는 경우에만) */}
        {work.content && (
          <div className="prose max-w-none mt-8" dangerouslySetInnerHTML={{ __html: work.content }} />
        )}
      </article>
    </>
  );
}